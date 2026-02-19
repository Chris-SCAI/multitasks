-- Migration: Add new plan values (etudiant, pro, equipe) to profiles table
-- Keep old values (ia_quotidienne, pro_sync) for backward compatibility

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'etudiant', 'pro', 'equipe', 'ia_quotidienne', 'pro_sync'));
