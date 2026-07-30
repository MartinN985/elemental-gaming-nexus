-- Safe ARG preview reset.
-- Clears visitor progress while preserving the 2,500 seeded ribbon tokens.
-- Run only against egn-arg-test (never against production).

DELETE FROM arg_invalid_attempts;
DELETE FROM arg_code_unlocks;
DELETE FROM arg_encounters;
DELETE FROM arg_visitors;

UPDATE arg_settings
SET setting_value = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE setting_key = 'global_phase_override';

-- Intentionally NOT deleting from arg_tokens.
