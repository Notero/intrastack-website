-- 0026_gdpr_erasure_fk_fixes.sql
-- Task 10A: GDPR/CCPA erasure needs supabase.auth.admin.deleteUser(id) to
-- cascade correctly through every table an account touches. Auditing every
-- FK back to auth.users/profiles across the tables task 9 (export) covers
-- shows the schema was already built with this in mind — nearly every
-- owning-side column is `on delete cascade` and every non-owning reference
-- (reviewed_by, assigned_to, recruiter_id, verified_by, outcome_by) is
-- already `on delete set null`.
--
-- 5 columns are miscategorized: they're the *other party* in a two-person
-- record, not the owning side, so `cascade` means deleting person A's
-- account silently destroys person B's data:
--   ticket_replies.author_id     — deleting a staff member erases their
--                                   replies on OTHER customers' tickets
--   onboarding_documents.uploaded_by — deleting the uploader (often the
--                                   customer) erases the applicant's docs
--   offer_letters.uploaded_by    — same, for offer letters
--   offer_letters.customer_id    — deleting the customer erases the
--                                   applicant's offer letter record
--   meetings.customer_id         — deleting the customer erases the
--                                   applicant's interview record
--
-- Fixed to `on delete set null`, matching the pattern already used for the
-- non-owning columns above. Constraint names are looked up dynamically
-- (not hardcoded) since they were never explicitly named at creation and
-- Postgres's auto-generated name isn't worth relying on blindly.

do $$
declare
  fixes text[][] := array[
    ['ticket_replies', 'author_id'],
    ['onboarding_documents', 'uploaded_by'],
    ['offer_letters', 'uploaded_by'],
    ['offer_letters', 'customer_id'],
    ['meetings', 'customer_id']
  ];
  fix text[];
  con_name text;
  ref_schema text;
  ref_table text;
begin
  foreach fix slice 1 in array fixes loop
    select con.conname, ns.nspname, ref.relname
      into con_name, ref_schema, ref_table
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = con.conkey[1]
    join pg_class rel    on rel.oid = con.conrelid
    join pg_class ref    on ref.oid = con.confrelid
    join pg_namespace ns on ns.oid = ref.relnamespace
    where con.contype = 'f'
      and rel.relname = fix[1]
      and att.attname = fix[2]
      and array_length(con.conkey, 1) = 1;

    if con_name is null then
      raise exception 'No FK constraint found for %.%', fix[1], fix[2];
    end if;

    execute format('alter table public.%I drop constraint %I', fix[1], con_name);
    execute format('alter table public.%I alter column %I drop not null', fix[1], fix[2]);
    execute format(
      'alter table public.%I add constraint %I foreign key (%I) references %I.%I(id) on delete set null',
      fix[1], con_name, fix[2], ref_schema, ref_table
    );
  end loop;
end $$;
