"""
Train a tiny single-speaker VITS model on the prepared LJSpeech-style dataset.

Based on Coqui TTS recipe:
https://github.com/coqui-ai/TTS/blob/dev/recipes/ljspeech/vits_tts/train_vits.py

Run (after preparing dataset + installing deps in the 3.11 venv):
  tts-training\.venv\Scripts\python tts-training\train_vits.py
"""

from __future__ import annotations

import os

from trainer import Trainer, TrainerArgs

from TTS.tts.configs.shared_configs import BaseDatasetConfig
from TTS.tts.configs.vits_config import VitsConfig
from TTS.tts.datasets import load_tts_samples
from TTS.tts.models.vits import Vits, VitsAudioConfig
from TTS.tts.utils.text.tokenizer import TTSTokenizer
from TTS.utils.audio import AudioProcessor


def main() -> None:
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_path = os.path.join(repo_root, "tts-training", "runs", "vits_neil")
    dataset_path = os.path.join(repo_root, "tts-training", "data", "cree_combined")

    dataset_config = BaseDatasetConfig(formatter="ljspeech", meta_file_train="metadata.csv", path=dataset_path)

    audio_config = VitsAudioConfig(sample_rate=22050, win_length=1024, hop_length=256, num_mels=80, mel_fmin=0, mel_fmax=None)

    # Small/CPU-friendly config (this is a *demo*, not a production training recipe).
    config = VitsConfig(
        audio=audio_config,
        run_name="vits_neil_plains_cree_demo",
        batch_size=4,
        eval_batch_size=2,
        batch_group_size=0,
        num_loader_workers=0,
        num_eval_loader_workers=0,
        run_eval=True,
        test_delay_epochs=-1,
        epochs=1000,
        eval_split_size=0.1,
        # Don't use phonemes for this first pass; keep it character-based.
        use_phonemes=False,
        compute_input_seq_cache=True,
        print_step=10,
        print_eval=True,
        mixed_precision=False,
        output_path=output_path,
        datasets=[dataset_config],
        cudnn_benchmark=False,
    )

    ap = AudioProcessor.init_from_config(config)
    tokenizer, config = TTSTokenizer.init_from_config(config)

    train_samples, eval_samples = load_tts_samples(
        dataset_config,
        eval_split=True,
        eval_split_max_size=config.eval_split_max_size,
        eval_split_size=config.eval_split_size,
    )

    model = Vits(config, ap, tokenizer, speaker_manager=None)

    trainer = Trainer(
        TrainerArgs(),
        config,
        output_path,
        model=model,
        train_samples=train_samples,
        eval_samples=eval_samples,
    )
    trainer.fit()


if __name__ == "__main__":
    main()

