[CmdletBinding()]
param(
    [string]$DatabaseDirectory = $PSScriptRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$studentsPath = Join-Path $DatabaseDirectory 'Students.json'
$studentAnswersPath = Join-Path $DatabaseDirectory 'mydb.studentAnswers.json'

function Read-JsonArray {
    param([string]$Path)

    $data = Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
    return @($data)
}

function Write-JsonArray {
    param(
        [string]$Path,
        [object[]]$Data
    )

    $Data | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $Path -Encoding utf8NoBOM
}

$students = Read-JsonArray -Path $studentsPath
$studentAnswers = Read-JsonArray -Path $studentAnswersPath

if (@($students.studentId | Select-Object -Unique).Count -ne $students.Count) {
    throw 'Students.json contains duplicate studentId values.'
}

# Include every identity found in either export so answers remain internally consistent.
$sourceIdentities = @{}
foreach ($student in $students) {
    $sourceId = [string]$student.studentId
    if ([string]::IsNullOrWhiteSpace($sourceId)) {
        throw 'Students.json contains a blank studentId.'
    }

    $sourceIdentities[$sourceId] = [pscustomobject]@{
        SourceStudentId = $sourceId
        SourceStudentName = [string]$student.studentName
    }
}

foreach ($answer in $studentAnswers) {
    $sourceId = [string]$answer.studentId
    if ([string]::IsNullOrWhiteSpace($sourceId)) {
        throw 'mydb.studentAnswers.json contains a blank studentId.'
    }

    $sourceName = [string]$answer.studentName
    if ($sourceIdentities.ContainsKey($sourceId)) {
        if (
            -not [string]::IsNullOrWhiteSpace($sourceName) -and
            -not [string]::IsNullOrWhiteSpace($sourceIdentities[$sourceId].SourceStudentName) -and
            $sourceIdentities[$sourceId].SourceStudentName -ne $sourceName
        ) {
            throw "Conflicting names found for studentId $sourceId."
        }
    } else {
        $sourceIdentities[$sourceId] = [pscustomobject]@{
            SourceStudentId = $sourceId
            SourceStudentName = $sourceName
        }
    }
}

$aliasesBySourceId = @{}
$orderedSourceIds = @($sourceIdentities.Keys | Sort-Object)
for ($index = 0; $index -lt $orderedSourceIds.Count; $index++) {
    $sourceId = $orderedSourceIds[$index]
    $aliasesBySourceId[$sourceId] = [pscustomobject]@{
        SourceStudentId = $sourceId
        SourceStudentName = $sourceIdentities[$sourceId].SourceStudentName
        StudentId = ('9{0:D8}' -f ($index + 1))
        StudentName = ('Student {0:D3}' -f ($index + 1))
        Password = ('D{0:D5}' -f ($index + 1))
    }
}

foreach ($student in $students) {
    $alias = $aliasesBySourceId[[string]$student.studentId]
    $student.studentId = $alias.StudentId
    $student.studentName = $alias.StudentName
    $student.password = $alias.Password
}

$aliases = @($aliasesBySourceId.Values | Sort-Object { $_.SourceStudentId.Length } -Descending)
for ($index = 0; $index -lt $studentAnswers.Count; $index++) {
    $answer = $studentAnswers[$index]
    $alias = $aliasesBySourceId[[string]$answer.studentId]
    $answer.studentId = $alias.StudentId
    $answer.studentName = $alias.StudentName

    foreach ($response in @($answer.answers)) {
        if ($null -eq $response.studentAnswer) {
            continue
        }

        $text = [string]$response.studentAnswer
        foreach ($replacement in $aliases) {
            $text = $text.Replace($replacement.SourceStudentId, $replacement.StudentId)
            if (-not [string]::IsNullOrWhiteSpace($replacement.SourceStudentName)) {
                $text = $text.Replace($replacement.SourceStudentName, $replacement.StudentName)
            }
        }
        $response.studentAnswer = $text
    }

    # Keep ordering useful for demos without retaining real submission timestamps.
    $createdAt = [DateTime]::SpecifyKind([DateTime]'2024-01-01T08:00:00', [DateTimeKind]::Utc).AddDays($index)
    $answer.createdAt = $createdAt.ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
    $answer.updatedAt = $createdAt.AddMinutes(15).ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
}

Write-JsonArray -Path $studentsPath -Data $students
Write-JsonArray -Path $studentAnswersPath -Data $studentAnswers

Write-Output "Anonymized $($students.Count) student records and $($studentAnswers.Count) student-answer records."
