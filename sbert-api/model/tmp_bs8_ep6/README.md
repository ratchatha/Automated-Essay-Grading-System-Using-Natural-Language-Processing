---
tags:
- sentence-transformers
- sentence-similarity
- feature-extraction
- dense
- generated_from_trainer
- dataset_size:352
- loss:CosineSimilarityLoss
base_model: airesearch/wangchanberta-base-att-spm-uncased
widget:
- source_sentence: อธิบายว่า "Agile Development" คืออะไร
  sentences:
  - 'Stack-dynamic variable ใช้เวลาน้อยที่สุด เพราะถูกสร้างทุกครั้งที่เรียกใช้ฟังก์ชัน '
  - Agile Development คือการพัฒนาโปรแกรมแบบรวดเร็ว
  - Sum_of_sales หรือ
- source_sentence: อธิบายความหมายของ "Concurrency Control" ในการจัดการฐานข้อมูล
  sentences:
  - Call by Value คือการส่งค่าตัวแปร ส่วน Call by Reference คือการส่งที่อยู่ของตัวแปร
  - Concurrency Control คือการจัดการการทำงานพร้อมกันในฐานข้อมูล
  - Refactoring คือการปรับปรุงโค้ด ส่วน Rewriting คือการเขียนโค้ดใหม่ทั้งหมด
- source_sentence: อธิบายว่า "Git" เป็นอะไรในกระบวนการพัฒนาโปรแกรม
  sentences:
  - เป็น strong typed เพราะไม่สามารถใช้ตัวแปรกับชนิดที่ไม่ตรงกันโดยไม่ประกาศ
  - Git คือระบบควบคุมเวอร์ชันที่ช่วยในการจัดการและติดตามการเปลี่ยนแปลงโค้ด
  - typedef enum { false, true }
- source_sentence: จงยกตัวอย่าง Web Browser อย่างน้อย 2 ตัวอย่าง
  sentences:
  - Static Typing เป็นการกำหนดชนิดข้อมูลล่วงหน้า ส่วน Dynamic Typing เป็นการกำหนดชนิดข้อมูลภายหลัง
  - Chrome
  - Agile Development คือกระบวนการพัฒนาโปรแกรมแบบยืดหยุ่นและรวดเร็วที่เน้นการทำงานร่วมกันระหว่างทีมพัฒนาและลูกค้า
    การปรับตัวตอบสนองต่อการเปลี่ยนแปลงได้อย่างรวดเร็วผ่านการพัฒนาในช่วงเวลาสั้นๆ (sprints)
    และการประเมินผลอย่างต่อเนื่อง ทำให้สามารถส่งมอบซอฟต์แวร์ที่มีคุณภาพสูงและตอบสนองความต้องการของลูกค้าได้อย่างมีประสิทธิภาพ
- source_sentence: อธิบายว่า "Loose Coupling" และ "Tight Coupling" ต่างกันอย่างไรในเชิงการออกแบบซอฟต์แวร์
  sentences:
  - Loose Coupling คือการเชื่อมต่อระหว่างโมดูลที่หลวม ส่วน Tight Coupling คือการเชื่อมต่อระหว่างโมดูลที่แน่น
  - sum-Of-Scores
  - Abstraction คือการซ่อนรายละเอียดการทำงานที่ไม่จำเป็น โดยแสดงเฉพาะส่วนที่จำเป็นในการใช้งาน
    ซึ่งช่วยลดความซับซ้อนของระบบ
pipeline_tag: sentence-similarity
library_name: sentence-transformers
metrics:
- pearson_cosine
- spearman_cosine
model-index:
- name: SentenceTransformer based on airesearch/wangchanberta-base-att-spm-uncased
  results:
  - task:
      type: semantic-similarity
      name: Semantic Similarity
    dataset:
      name: Unknown
      type: unknown
    metrics:
    - type: pearson_cosine
      value: 0.3784716931014668
      name: Pearson Cosine
    - type: spearman_cosine
      value: 0.4402937081086579
      name: Spearman Cosine
---

# SentenceTransformer based on airesearch/wangchanberta-base-att-spm-uncased

This is a [sentence-transformers](https://www.SBERT.net) model finetuned from [airesearch/wangchanberta-base-att-spm-uncased](https://huggingface.co/airesearch/wangchanberta-base-att-spm-uncased). It maps sentences & paragraphs to a 768-dimensional dense vector space and can be used for semantic textual similarity, semantic search, paraphrase mining, text classification, clustering, and more.

## Model Details

### Model Description
- **Model Type:** Sentence Transformer
- **Base model:** [airesearch/wangchanberta-base-att-spm-uncased](https://huggingface.co/airesearch/wangchanberta-base-att-spm-uncased) <!-- at revision b81d38df6b4755dbedec0bfea863c9956cbb963e -->
- **Maximum Sequence Length:** 512 tokens
- **Output Dimensionality:** 768 dimensions
- **Similarity Function:** Cosine Similarity
<!-- - **Training Dataset:** Unknown -->
<!-- - **Language:** Unknown -->
<!-- - **License:** Unknown -->

### Model Sources

- **Documentation:** [Sentence Transformers Documentation](https://sbert.net)
- **Repository:** [Sentence Transformers on GitHub](https://github.com/UKPLab/sentence-transformers)
- **Hugging Face:** [Sentence Transformers on Hugging Face](https://huggingface.co/models?library=sentence-transformers)

### Full Model Architecture

```
SentenceTransformer(
  (0): Transformer({'max_seq_length': 512, 'do_lower_case': False, 'architecture': 'CamembertModel'})
  (1): Pooling({'word_embedding_dimension': 768, 'pooling_mode_cls_token': False, 'pooling_mode_mean_tokens': True, 'pooling_mode_max_tokens': False, 'pooling_mode_mean_sqrt_len_tokens': False, 'pooling_mode_weightedmean_tokens': False, 'pooling_mode_lasttoken': False, 'include_prompt': True})
)
```

## Usage

### Direct Usage (Sentence Transformers)

First install the Sentence Transformers library:

```bash
pip install -U sentence-transformers
```

Then you can load this model and run inference.
```python
from sentence_transformers import SentenceTransformer

# Download from the 🤗 Hub
model = SentenceTransformer("sentence_transformers_model_id")
# Run inference
sentences = [
    'อธิบายว่า "Loose Coupling" และ "Tight Coupling" ต่างกันอย่างไรในเชิงการออกแบบซอฟต์แวร์',
    'Loose Coupling คือการเชื่อมต่อระหว่างโมดูลที่หลวม ส่วน Tight Coupling คือการเชื่อมต่อระหว่างโมดูลที่แน่น',
    'sum-Of-Scores',
]
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 768]

# Get the similarity scores for the embeddings
similarities = model.similarity(embeddings, embeddings)
print(similarities)
# tensor([[1.0000, 0.7482, 0.1640],
#         [0.7482, 1.0000, 0.2706],
#         [0.1640, 0.2706, 1.0000]])
```

<!--
### Direct Usage (Transformers)

<details><summary>Click to see the direct usage in Transformers</summary>

</details>
-->

<!--
### Downstream Usage (Sentence Transformers)

You can finetune this model on your own dataset.

<details><summary>Click to expand</summary>

</details>
-->

<!--
### Out-of-Scope Use

*List how the model may foreseeably be misused and address what users ought not to do with the model.*
-->

## Evaluation

### Metrics

#### Semantic Similarity

* Evaluated with [<code>EmbeddingSimilarityEvaluator</code>](https://sbert.net/docs/package_reference/sentence_transformer/evaluation.html#sentence_transformers.evaluation.EmbeddingSimilarityEvaluator)

| Metric              | Value      |
|:--------------------|:-----------|
| pearson_cosine      | 0.3785     |
| **spearman_cosine** | **0.4403** |

<!--
## Bias, Risks and Limitations

*What are the known or foreseeable issues stemming from this model? You could also flag here known failure cases or weaknesses of the model.*
-->

<!--
### Recommendations

*What are recommendations with respect to the foreseeable issues? For example, filtering explicit content.*
-->

## Training Details

### Training Dataset

#### Unnamed Dataset

* Size: 352 training samples
* Columns: <code>sentence_0</code>, <code>sentence_1</code>, and <code>label</code>
* Approximate statistics based on the first 352 samples:
  |         | sentence_0                                                                         | sentence_1                                                                         | label                                                          |
  |:--------|:-----------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------|:---------------------------------------------------------------|
  | type    | string                                                                             | string                                                                             | float                                                          |
  | details | <ul><li>min: 11 tokens</li><li>mean: 22.49 tokens</li><li>max: 50 tokens</li></ul> | <ul><li>min: 4 tokens</li><li>mean: 23.86 tokens</li><li>max: 104 tokens</li></ul> | <ul><li>min: 0.0</li><li>mean: 0.48</li><li>max: 1.0</li></ul> |
* Samples:
  | sentence_0                                                                       | sentence_1                                                                                                     | label            |
  |:---------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------|:-----------------|
  | <code>อธิบายความแตกต่างระหว่าง "Statement" และ "Expression" ในภาษาโปรแกรม</code> | <code>Statement คือคำสั่งที่ทำงานในโปรแกรมและไม่คืนค่า ส่วน Expression คือการคำนวณที่มีผลลัพธ์และคืนค่า</code> | <code>0.8</code> |
  | <code>อธิบายว่า "Closure" คืออะไรในภาษาโปรแกรม</code>                            | <code>Closure คือการปิดโปรแกรม</code>                                                                          | <code>0.0</code> |
  | <code>สร้าง user-defined type ชื่อ Boolean ในภาษา C</code>                       | <code>typedef enum { false,</code>                                                                             | <code>0.4</code> |
* Loss: [<code>CosineSimilarityLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#cosinesimilarityloss) with these parameters:
  ```json
  {
      "loss_fct": "torch.nn.modules.loss.MSELoss"
  }
  ```

### Training Hyperparameters
#### Non-Default Hyperparameters

- `eval_strategy`: steps
- `num_train_epochs`: 6
- `multi_dataset_batch_sampler`: round_robin

#### All Hyperparameters
<details><summary>Click to expand</summary>

- `overwrite_output_dir`: False
- `do_predict`: False
- `eval_strategy`: steps
- `prediction_loss_only`: True
- `per_device_train_batch_size`: 8
- `per_device_eval_batch_size`: 8
- `per_gpu_train_batch_size`: None
- `per_gpu_eval_batch_size`: None
- `gradient_accumulation_steps`: 1
- `eval_accumulation_steps`: None
- `torch_empty_cache_steps`: None
- `learning_rate`: 5e-05
- `weight_decay`: 0.0
- `adam_beta1`: 0.9
- `adam_beta2`: 0.999
- `adam_epsilon`: 1e-08
- `max_grad_norm`: 1
- `num_train_epochs`: 6
- `max_steps`: -1
- `lr_scheduler_type`: linear
- `lr_scheduler_kwargs`: {}
- `warmup_ratio`: 0.0
- `warmup_steps`: 0
- `log_level`: passive
- `log_level_replica`: warning
- `log_on_each_node`: True
- `logging_nan_inf_filter`: True
- `save_safetensors`: True
- `save_on_each_node`: False
- `save_only_model`: False
- `restore_callback_states_from_checkpoint`: False
- `no_cuda`: False
- `use_cpu`: False
- `use_mps_device`: False
- `seed`: 42
- `data_seed`: None
- `jit_mode_eval`: False
- `use_ipex`: False
- `bf16`: False
- `fp16`: False
- `fp16_opt_level`: O1
- `half_precision_backend`: auto
- `bf16_full_eval`: False
- `fp16_full_eval`: False
- `tf32`: None
- `local_rank`: 0
- `ddp_backend`: None
- `tpu_num_cores`: None
- `tpu_metrics_debug`: False
- `debug`: []
- `dataloader_drop_last`: False
- `dataloader_num_workers`: 0
- `dataloader_prefetch_factor`: None
- `past_index`: -1
- `disable_tqdm`: False
- `remove_unused_columns`: True
- `label_names`: None
- `load_best_model_at_end`: False
- `ignore_data_skip`: False
- `fsdp`: []
- `fsdp_min_num_params`: 0
- `fsdp_config`: {'min_num_params': 0, 'xla': False, 'xla_fsdp_v2': False, 'xla_fsdp_grad_ckpt': False}
- `fsdp_transformer_layer_cls_to_wrap`: None
- `accelerator_config`: {'split_batches': False, 'dispatch_batches': None, 'even_batches': True, 'use_seedable_sampler': True, 'non_blocking': False, 'gradient_accumulation_kwargs': None}
- `deepspeed`: None
- `label_smoothing_factor`: 0.0
- `optim`: adamw_torch
- `optim_args`: None
- `adafactor`: False
- `group_by_length`: False
- `length_column_name`: length
- `ddp_find_unused_parameters`: None
- `ddp_bucket_cap_mb`: None
- `ddp_broadcast_buffers`: False
- `dataloader_pin_memory`: True
- `dataloader_persistent_workers`: False
- `skip_memory_metrics`: True
- `use_legacy_prediction_loop`: False
- `push_to_hub`: False
- `resume_from_checkpoint`: None
- `hub_model_id`: None
- `hub_strategy`: every_save
- `hub_private_repo`: None
- `hub_always_push`: False
- `hub_revision`: None
- `gradient_checkpointing`: False
- `gradient_checkpointing_kwargs`: None
- `include_inputs_for_metrics`: False
- `include_for_metrics`: []
- `eval_do_concat_batches`: True
- `fp16_backend`: auto
- `push_to_hub_model_id`: None
- `push_to_hub_organization`: None
- `mp_parameters`: 
- `auto_find_batch_size`: False
- `full_determinism`: False
- `torchdynamo`: None
- `ray_scope`: last
- `ddp_timeout`: 1800
- `torch_compile`: False
- `torch_compile_backend`: None
- `torch_compile_mode`: None
- `include_tokens_per_second`: False
- `include_num_input_tokens_seen`: False
- `neftune_noise_alpha`: None
- `optim_target_modules`: None
- `batch_eval_metrics`: False
- `eval_on_start`: False
- `use_liger_kernel`: False
- `liger_kernel_config`: None
- `eval_use_gather_object`: False
- `average_tokens_across_devices`: False
- `prompts`: None
- `batch_sampler`: batch_sampler
- `multi_dataset_batch_sampler`: round_robin
- `router_mapping`: {}
- `learning_rate_mapping`: {}

</details>

### Training Logs
| Epoch  | Step | spearman_cosine |
|:------:|:----:|:---------------:|
| 0.2273 | 10   | 0.1636          |
| 0.4545 | 20   | 0.1838          |
| 0.6818 | 30   | 0.1610          |
| 0.9091 | 40   | 0.3279          |
| 1.0    | 44   | 0.3553          |
| 1.1364 | 50   | 0.3748          |
| 1.3636 | 60   | 0.4303          |
| 1.5909 | 70   | 0.2973          |
| 1.8182 | 80   | 0.3471          |
| 2.0    | 88   | 0.4366          |
| 2.0455 | 90   | 0.4367          |
| 2.2727 | 100  | 0.4403          |


### Framework Versions
- Python: 3.10.18
- Sentence Transformers: 5.1.0
- Transformers: 4.55.2
- PyTorch: 2.5.1+cu121
- Accelerate: 1.10.0
- Datasets: 2.14.4
- Tokenizers: 0.21.4

## Citation

### BibTeX

#### Sentence Transformers
```bibtex
@inproceedings{reimers-2019-sentence-bert,
    title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
    author = "Reimers, Nils and Gurevych, Iryna",
    booktitle = "Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing",
    month = "11",
    year = "2019",
    publisher = "Association for Computational Linguistics",
    url = "https://arxiv.org/abs/1908.10084",
}
```

<!--
## Glossary

*Clearly define terms in order to be accessible across audiences.*
-->

<!--
## Model Card Authors

*Lists the people who create the model card, providing recognition and accountability for the detailed work that goes into its construction.*
-->

<!--
## Model Card Contact

*Provides a way for people who have updates to the Model Card, suggestions, or questions, to contact the Model Card authors.*
-->