-- seed_applicant_data.sql
-- Mock data for applicant portal tables: applications, saved_jobs, notifications.
--
-- HOW TO USE:
--   1. Make sure migrations 0020, 0021, 0022 have been run first.
--   2. Replace 'applicant@test.com' below with the email of your test applicant account.
--   3. Run this script against your Supabase project (SQL editor or psql).
--
-- The script is safe to re-run — all inserts use ON CONFLICT DO NOTHING.

do $$
declare
  applicant_uid uuid;
  job1_id       uuid;
  job2_id       uuid;
  job3_id       uuid;
begin
  -- Resolve the test applicant user id
  select id into applicant_uid
  from auth.users
  where email = 'applicant@test.com'
  limit 1;

  if applicant_uid is null then
    raise notice 'No user found with email applicant@test.com — skipping seed.';
    return;
  end if;

  -- Grab three published job post ids to reference
  select id into job1_id from public.job_posts where published = true order by posted_at desc limit 1 offset 0;
  select id into job2_id from public.job_posts where published = true order by posted_at desc limit 1 offset 1;
  select id into job3_id from public.job_posts where published = true order by posted_at desc limit 1 offset 2;

  -- ─── applications ────────────────────────────────────────────────────────

  if job1_id is not null then
    insert into public.applications
      (applicant_id, job_post_id, status, notes, created_at)
    values
      (
        applicant_uid, job1_id, 'reviewing',
        'Applied via careers board. Awaiting recruiter response.',
        now() - interval '3 days'
      )
    on conflict (applicant_id, job_post_id) do nothing;
  end if;

  if job2_id is not null then
    insert into public.applications
      (applicant_id, job_post_id, status, notes, created_at)
    values
      (
        applicant_uid, job2_id, 'interview',
        'Technical interview scheduled for next week.',
        now() - interval '10 days'
      )
    on conflict (applicant_id, job_post_id) do nothing;
  end if;

  if job3_id is not null then
    insert into public.applications
      (applicant_id, job_post_id, status, created_at)
    values
      (
        applicant_uid, job3_id, 'rejected',
        now() - interval '20 days'
      )
    on conflict (applicant_id, job_post_id) do nothing;
  end if;

  -- ─── saved_jobs ──────────────────────────────────────────────────────────

  if job1_id is not null then
    insert into public.saved_jobs (applicant_id, job_post_id)
    values (applicant_uid, job1_id)
    on conflict (applicant_id, job_post_id) do nothing;
  end if;

  if job2_id is not null then
    insert into public.saved_jobs (applicant_id, job_post_id)
    values (applicant_uid, job2_id)
    on conflict (applicant_id, job_post_id) do nothing;
  end if;

  -- ─── notifications ───────────────────────────────────────────────────────
  -- Insert via service-role context (RLS allows admin/service-role inserts only).
  -- If running from the SQL editor as a superuser this will work directly.

  insert into public.notifications
    (user_id, kind, title, body, read, created_at)
  values
    (
      applicant_uid, 'job',
      'New job match: Senior Cloud Engineer',
      'A new role matching your profile was posted today. Check it out on the Careers page.',
      false,
      now() - interval '1 hour'
    ),
    (
      applicant_uid, 'info',
      'Application status updated',
      'Your application has moved to the Interview stage. The recruiter will be in touch shortly.',
      false,
      now() - interval '2 days'
    ),
    (
      applicant_uid, 'alert',
      'Profile incomplete',
      'Add your phone number and location to improve your profile visibility to recruiters.',
      true,
      now() - interval '4 days'
    ),
    (
      applicant_uid, 'info',
      'Welcome to Intrastack',
      'Your account is active. Complete your profile and upload your resume to get started.',
      true,
      now() - interval '7 days'
    )
  on conflict do nothing;

end $$;
