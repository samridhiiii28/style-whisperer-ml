
CREATE TABLE public.analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  detected_item text NOT NULL,
  detected_colors jsonb NOT NULL DEFAULT '[]',
  occasion jsonb NOT NULL DEFAULT '{}',
  suggestions jsonb NOT NULL DEFAULT '{}',
  color_compatibility jsonb NOT NULL DEFAULT '{}',
  style_analysis text,
  overall_score numeric,
  uploaded_image text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own history"
  ON public.analysis_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON public.analysis_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history"
  ON public.analysis_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
