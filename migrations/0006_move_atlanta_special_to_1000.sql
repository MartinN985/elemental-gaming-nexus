-- Remap Atlanta special from ribbon 2500 to ribbon 1000 for the 1000-ribbon print run.
UPDATE arg_tokens
SET special_slug = NULL
WHERE ribbon_no = 2500;

UPDATE arg_tokens
SET special_slug = 'atlanta-assessment'
WHERE ribbon_no = 1000;
