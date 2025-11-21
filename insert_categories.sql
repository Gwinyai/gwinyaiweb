-- Insert default categories for the blog
insert into public.categories (name, slug)
values
  ('AI and Machine Learning', 'ai-and-machine-learning'),
  ('Mobile Apps', 'mobile-apps'),
  ('Web and Backend', 'web-and-backend')
on conflict (slug) do nothing;

