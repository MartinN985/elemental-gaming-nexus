-- Ribbons 0004 and 0005 remain valid tokens but are no longer specials.
UPDATE arg_tokens
SET special_slug = NULL
WHERE ribbon_no IN (4, 5);
