export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string
          department: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_profiles: {
        Row: {
          bio: string | null
          created_at: string
          current_company: string | null
          current_title: string | null
          github_url: string | null
          headline: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          open_to_work: boolean
          portfolio_url: string | null
          resume_url: string | null
          skills: string[]
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_title?: string | null
          github_url?: string | null
          headline?: string | null
          id: string
          linkedin_url?: string | null
          location?: string | null
          open_to_work?: boolean
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[]
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_title?: string | null
          github_url?: string | null
          headline?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          open_to_work?: boolean
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[]
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applicant_id: string
          cover_letter: string | null
          cover_letter_url: string | null
          created_at: string
          id: string
          job_post_id: string
          notes: string | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          applicant_id: string
          cover_letter?: string | null
          cover_letter_url?: string | null
          created_at?: string
          id?: string
          job_post_id: string
          notes?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          cover_letter?: string | null
          cover_letter_url?: string | null
          created_at?: string
          id?: string
          job_post_id?: string
          notes?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          after: Json | null
          before: Json | null
          created_at: string
          id: string
          ip_address: string | null
          row_id: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          row_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          row_id?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      chat_leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          phone: string | null
          service: string | null
          source_path: string | null
          status: string
          timeline: string | null
          user_agent: string | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
          source_path?: string | null
          status?: string
          timeline?: string | null
          user_agent?: string | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
          source_path?: string | null
          status?: string
          timeline?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      contact_form_leads: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          company: string | null
          company_size: string | null
          consent_given_at: string | null
          consent_to_contact: boolean
          consent_version: string | null
          created_at: string
          full_name: string
          id: string
          interests: string[]
          internal_notes: string | null
          job_title: string | null
          message: string
          nda_required: boolean
          newsletter_opt_in: boolean
          phone: string | null
          preferred_contact: string | null
          source_path: string | null
          status: string
          timeline: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          work_email: string
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          company?: string | null
          company_size?: string | null
          consent_given_at?: string | null
          consent_to_contact?: boolean
          consent_version?: string | null
          created_at?: string
          full_name: string
          id?: string
          interests?: string[]
          internal_notes?: string | null
          job_title?: string | null
          message: string
          nda_required?: boolean
          newsletter_opt_in?: boolean
          phone?: string | null
          preferred_contact?: string | null
          source_path?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          work_email: string
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          company?: string | null
          company_size?: string | null
          consent_given_at?: string | null
          consent_to_contact?: boolean
          consent_version?: string | null
          created_at?: string
          full_name?: string
          id?: string
          interests?: string[]
          internal_notes?: string | null
          job_title?: string | null
          message?: string
          nda_required?: boolean
          newsletter_opt_in?: boolean
          phone?: string | null
          preferred_contact?: string | null
          source_path?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          work_email?: string
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          linkedin_url: string | null
          title: string | null
          updated_at: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id: string
          linkedin_url?: string | null
          title?: string | null
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          title?: string | null
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiter_profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_post_history: {
        Row: {
          created_at: string
          description: string | null
          employment_type: Database["public"]["Enums"]["employment_type"]
          id: string
          job_post_id: string | null
          location: string
          nice_to_have: string[] | null
          outcome: Database["public"]["Enums"]["job_outcome"]
          outcome_at: string
          outcome_by: string | null
          reason: string | null
          recruiter_id: string | null
          remote: boolean
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          seniority: string | null
          short_description: string
          tags: string[] | null
          team: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employment_type: Database["public"]["Enums"]["employment_type"]
          id?: string
          job_post_id?: string | null
          location: string
          nice_to_have?: string[] | null
          outcome: Database["public"]["Enums"]["job_outcome"]
          outcome_at?: string
          outcome_by?: string | null
          reason?: string | null
          recruiter_id?: string | null
          remote?: boolean
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          seniority?: string | null
          short_description: string
          tags?: string[] | null
          team?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employment_type?: Database["public"]["Enums"]["employment_type"]
          id?: string
          job_post_id?: string | null
          location?: string
          nice_to_have?: string[] | null
          outcome?: Database["public"]["Enums"]["job_outcome"]
          outcome_at?: string
          outcome_by?: string | null
          reason?: string | null
          recruiter_id?: string | null
          remote?: boolean
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          seniority?: string | null
          short_description?: string
          tags?: string[] | null
          team?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_post_history_outcome_by_fkey"
            columns: ["outcome_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_post_history_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          created_at: string
          customer_id: string | null
          description: string | null
          employment_type: Database["public"]["Enums"]["employment_type"]
          id: string
          location: string
          nice_to_have: string[] | null
          posted_at: string
          published: boolean
          recruiter_id: string | null
          remote: boolean
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          seniority: string | null
          short_description: string
          slug: string
          tags: string[] | null
          team: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          description?: string | null
          employment_type: Database["public"]["Enums"]["employment_type"]
          id?: string
          location: string
          nice_to_have?: string[] | null
          posted_at?: string
          published?: boolean
          recruiter_id?: string | null
          remote?: boolean
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          seniority?: string | null
          short_description: string
          slug: string
          tags?: string[] | null
          team?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          description?: string | null
          employment_type?: Database["public"]["Enums"]["employment_type"]
          id?: string
          location?: string
          nice_to_have?: string[] | null
          posted_at?: string
          published?: boolean
          recruiter_id?: string | null
          remote?: boolean
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          seniority?: string | null
          short_description?: string
          slug?: string
          tags?: string[] | null
          team?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_posts_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leadership_people: {
        Row: {
          certifications: string[]
          closing: string | null
          created_at: string
          display_order: number
          email: string | null
          group_name: Database["public"]["Enums"]["leadership_group"]
          highlights: Json
          id: string
          instagram_url: string | null
          intro: string[]
          linkedin_url: string | null
          name: string
          phone: string | null
          photo_path: string | null
          published: boolean
          region: string | null
          slug: string
          title: string
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          certifications?: string[]
          closing?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          group_name: Database["public"]["Enums"]["leadership_group"]
          highlights?: Json
          id?: string
          instagram_url?: string | null
          intro?: string[]
          linkedin_url?: string | null
          name: string
          phone?: string | null
          photo_path?: string | null
          published?: boolean
          region?: string | null
          slug: string
          title: string
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          certifications?: string[]
          closing?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          group_name?: Database["public"]["Enums"]["leadership_group"]
          highlights?: Json
          id?: string
          instagram_url?: string | null
          intro?: string[]
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          photo_path?: string | null
          published?: boolean
          region?: string | null
          slug?: string
          title?: string
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          applicant_id: string
          application_id: string
          created_at: string
          customer_id: string
          duration_minutes: number
          id: string
          job_post_id: string
          meeting_link: string | null
          notes: string | null
          proposed_at: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["meeting_status"]
        }
        Insert: {
          applicant_id: string
          application_id: string
          created_at?: string
          customer_id: string
          duration_minutes?: number
          id?: string
          job_post_id: string
          meeting_link?: string | null
          notes?: string | null
          proposed_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["meeting_status"]
        }
        Update: {
          applicant_id?: string
          application_id?: string
          created_at?: string
          customer_id?: string
          duration_minutes?: number
          id?: string
          job_post_id?: string
          meeting_link?: string | null
          notes?: string | null
          proposed_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["meeting_status"]
        }
        Relationships: [
          {
            foreignKeyName: "meetings_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      news_items: {
        Row: {
          author: string | null
          body: string | null
          client: string | null
          cover_image_path: string
          created_at: string
          excerpt: string
          file_size: string | null
          file_url: string | null
          id: string
          image_2_path: string | null
          image_3_path: string | null
          industry: string | null
          kind: Database["public"]["Enums"]["news_kind"]
          metric_label: string | null
          metric_value: string | null
          pages: number | null
          published: boolean
          published_at: string
          read_time: number | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          body?: string | null
          client?: string | null
          cover_image_path: string
          created_at?: string
          excerpt: string
          file_size?: string | null
          file_url?: string | null
          id?: string
          image_2_path?: string | null
          image_3_path?: string | null
          industry?: string | null
          kind: Database["public"]["Enums"]["news_kind"]
          metric_label?: string | null
          metric_value?: string | null
          pages?: number | null
          published?: boolean
          published_at?: string
          read_time?: number | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          body?: string | null
          client?: string | null
          cover_image_path?: string
          created_at?: string
          excerpt?: string
          file_size?: string | null
          file_url?: string | null
          id?: string
          image_2_path?: string | null
          image_3_path?: string | null
          industry?: string | null
          kind?: Database["public"]["Enums"]["news_kind"]
          metric_label?: string | null
          metric_value?: string | null
          pages?: number | null
          published?: boolean
          published_at?: string
          read_time?: number | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["notification_kind"]
          read: boolean
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["notification_kind"]
          read?: boolean
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["notification_kind"]
          read?: boolean
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      offer_letters: {
        Row: {
          accepted_at: string | null
          applicant_id: string
          application_id: string
          created_at: string
          customer_id: string
          file_path: string
          id: string
          job_post_id: string
          signed_at: string | null
          signed_file_path: string | null
          status: Database["public"]["Enums"]["offer_letter_status"]
          uploaded_by: string
        }
        Insert: {
          accepted_at?: string | null
          applicant_id: string
          application_id: string
          created_at?: string
          customer_id: string
          file_path: string
          id?: string
          job_post_id: string
          signed_at?: string | null
          signed_file_path?: string | null
          status?: Database["public"]["Enums"]["offer_letter_status"]
          uploaded_by: string
        }
        Update: {
          accepted_at?: string | null
          applicant_id?: string
          application_id?: string
          created_at?: string
          customer_id?: string
          file_path?: string
          id?: string
          job_post_id?: string
          signed_at?: string | null
          signed_file_path?: string | null
          status?: Database["public"]["Enums"]["offer_letter_status"]
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "offer_letters_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_letters_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_letters_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_documents: {
        Row: {
          accepted_at: string | null
          application_id: string
          created_at: string
          downloaded_at: string | null
          file_path: string
          id: string
          label: string
          rejected_at: string | null
          required: boolean
          signed_at: string | null
          signed_file_path: string | null
          status: Database["public"]["Enums"]["onboarding_document_status"]
          uploaded_by: string
        }
        Insert: {
          accepted_at?: string | null
          application_id: string
          created_at?: string
          downloaded_at?: string | null
          file_path: string
          id?: string
          label: string
          rejected_at?: string | null
          required?: boolean
          signed_at?: string | null
          signed_file_path?: string | null
          status?: Database["public"]["Enums"]["onboarding_document_status"]
          uploaded_by: string
        }
        Update: {
          accepted_at?: string | null
          application_id?: string
          created_at?: string
          downloaded_at?: string | null
          file_path?: string
          id?: string
          label?: string
          rejected_at?: string | null
          required?: boolean
          signed_at?: string | null
          signed_file_path?: string | null
          status?: Database["public"]["Enums"]["onboarding_document_status"]
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          consent_given_at: string | null
          consent_version: string | null
          created_at: string
          display_name: string | null
          email: string | null
          employer_id: string | null
          employer_since: string | null
          full_name: string | null
          id: string
          last_sign_in_at: string | null
          locale: string
          metadata: Json
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          signed_for_representation: boolean
          status: Database["public"]["Enums"]["user_status"]
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          consent_given_at?: string | null
          consent_version?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          employer_id?: string | null
          employer_since?: string | null
          full_name?: string | null
          id: string
          last_sign_in_at?: string | null
          locale?: string
          metadata?: Json
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          signed_for_representation?: boolean
          status?: Database["public"]["Enums"]["user_status"]
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          consent_given_at?: string | null
          consent_version?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          employer_id?: string | null
          employer_since?: string | null
          full_name?: string | null
          id?: string
          last_sign_in_at?: string | null
          locale?: string
          metadata?: Json
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          signed_for_representation?: boolean
          status?: Database["public"]["Enums"]["user_status"]
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      resume_matches: {
        Row: {
          applicant_id: string
          created_at: string
          gaps: string[]
          id: string
          job_post_id: string | null
          job_title: string
          matched_skills: string[]
          rank: number
          reasoning: string | null
          resume_parse_id: string
          score: number
          stub: boolean
        }
        Insert: {
          applicant_id: string
          created_at?: string
          gaps?: string[]
          id?: string
          job_post_id?: string | null
          job_title: string
          matched_skills?: string[]
          rank: number
          reasoning?: string | null
          resume_parse_id: string
          score: number
          stub?: boolean
        }
        Update: {
          applicant_id?: string
          created_at?: string
          gaps?: string[]
          id?: string
          job_post_id?: string | null
          job_title?: string
          matched_skills?: string[]
          rank?: number
          reasoning?: string | null
          resume_parse_id?: string
          score?: number
          stub?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "resume_matches_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_matches_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_matches_resume_parse_id_fkey"
            columns: ["resume_parse_id"]
            isOneToOne: false
            referencedRelation: "resume_parses"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_parses: {
        Row: {
          applicant_id: string
          created_at: string
          id: string
          model: string | null
          parsed: Json
          source_filename: string | null
          stub: boolean
        }
        Insert: {
          applicant_id: string
          created_at?: string
          id?: string
          model?: string | null
          parsed: Json
          source_filename?: string | null
          stub?: boolean
        }
        Update: {
          applicant_id?: string
          created_at?: string
          id?: string
          model?: string | null
          parsed?: Json
          source_filename?: string | null
          stub?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "resume_parses_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          applicant_id: string
          created_at: string
          id: string
          job_post_id: string
        }
        Insert: {
          applicant_id: string
          created_at?: string
          id?: string
          job_post_id: string
        }
        Update: {
          applicant_id?: string
          created_at?: string
          id?: string
          job_post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_pool: {
        Row: {
          applicant_id: string
          candidate_headline: string | null
          candidate_name: string | null
          candidate_skills: string[]
          candidate_title: string | null
          candidate_years: number | null
          created_at: string
          gaps: string[]
          id: string
          job_post_id: string
          matched_skills: string[]
          reasoning: string | null
          resume_parse_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          score: number | null
          source: Database["public"]["Enums"]["talent_source"]
          status: Database["public"]["Enums"]["talent_status"]
        }
        Insert: {
          applicant_id: string
          candidate_headline?: string | null
          candidate_name?: string | null
          candidate_skills?: string[]
          candidate_title?: string | null
          candidate_years?: number | null
          created_at?: string
          gaps?: string[]
          id?: string
          job_post_id: string
          matched_skills?: string[]
          reasoning?: string | null
          resume_parse_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          score?: number | null
          source: Database["public"]["Enums"]["talent_source"]
          status?: Database["public"]["Enums"]["talent_status"]
        }
        Update: {
          applicant_id?: string
          candidate_headline?: string | null
          candidate_name?: string | null
          candidate_skills?: string[]
          candidate_title?: string | null
          candidate_years?: number | null
          created_at?: string
          gaps?: string[]
          id?: string
          job_post_id?: string
          matched_skills?: string[]
          reasoning?: string | null
          resume_parse_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          score?: number | null
          source?: Database["public"]["Enums"]["talent_source"]
          status?: Database["public"]["Enums"]["talent_status"]
        }
        Relationships: [
          {
            foreignKeyName: "talent_pool_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_pool_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_pool_resume_parse_id_fkey"
            columns: ["resume_parse_id"]
            isOneToOne: false
            referencedRelation: "resume_parses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_pool_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_replies: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          is_admin: boolean
          ticket_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          is_admin?: boolean
          ticket_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          is_admin?: boolean
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["ticket_category"]
          closed_at: string | null
          created_at: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          requester_id: string
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["ticket_category"]
          closed_at?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          requester_id: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["ticket_category"]
          closed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          requester_id?: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whitepaper_leads: {
        Row: {
          consent_given: boolean
          consent_given_at: string | null
          consent_version: string | null
          created_at: string
          email: string
          id: string
          intent: string | null
          news_item_slug: string
          news_item_title: string | null
        }
        Insert: {
          consent_given?: boolean
          consent_given_at?: string | null
          consent_version?: string | null
          created_at?: string
          email: string
          id?: string
          intent?: string | null
          news_item_slug: string
          news_item_title?: string | null
        }
        Update: {
          consent_given?: boolean
          consent_given_at?: string | null
          consent_version?: string | null
          created_at?: string
          email?: string
          id?: string
          intent?: string | null
          news_item_slug?: string
          news_item_title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      leads_pool: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          intent: string | null
          name: string | null
          notes: string | null
          resource_slug: string | null
          resource_title: string | null
          source: Database["public"]["Enums"]["lead_source"] | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      auth_customer_verification: {
        Args: never
        Returns: {
          verified: boolean
          verified_at: string
          verified_by: string
        }[]
      }
      auth_is_admin: { Args: never; Returns: boolean }
      auth_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      auth_user_status: {
        Args: never
        Returns: Database["public"]["Enums"]["user_status"]
      }
      can_manage_job_talent: {
        Args: { p_job_post_id: string }
        Returns: boolean
      }
      list_match_candidates: {
        Args: { p_job_post_id: string }
        Returns: {
          applicant_id: string
          current_title: string
          full_name: string
          headline: string
          parsed: Json
          resume_parse_id: string
          skills: string[]
          years_experience: number
        }[]
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_actor_id: string
          p_actor_role: string
          p_after: Json
          p_before?: Json
          p_ip_address: string
          p_row_id?: string
          p_table_name?: string
        }
        Returns: undefined
      }
      mark_onboarding_document_downloaded: {
        Args: { doc_file_path: string }
        Returns: undefined
      }
      notify_talent_decision: {
        Args: { p_accepted: boolean; p_talent_pool_id: string }
        Returns: undefined
      }
      purge_old_audit_log: { Args: never; Returns: undefined }
      ticket_owned_by: {
        Args: { p_ticket_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status:
        | "submitted"
        | "reviewing"
        | "interview"
        | "offer"
        | "accepted"
        | "rejected"
        | "withdrawn"
      employment_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "freelance"
        | "internship"
        | "temporary"
      job_outcome: "approved" | "rejected" | "withdrawn"
      lead_source:
        | "contact_form"
        | "whitepaper_download"
        | "newsletter_signup"
        | "chatbot"
      leadership_group: "founder" | "executive" | "vp" | "director" | "advisor"
      meeting_status:
        | "requested"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "onboarding"
      news_kind: "blog" | "trend" | "whitepaper" | "client_story" | "press"
      notification_kind: "job" | "application" | "info" | "alert"
      offer_letter_status: "sent" | "signed" | "accepted"
      onboarding_document_status: "sent" | "signed" | "accepted" | "rejected"
      talent_source: "direct_application" | "auto_match"
      talent_status: "pending" | "accepted" | "rejected"
      ticket_category:
        | "billing"
        | "technical"
        | "job_listing"
        | "account"
        | "other"
      ticket_priority: "low" | "normal" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "admin" | "customer" | "recruiter" | "applicant"
      user_status: "active" | "invited" | "suspended" | "deactivated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "submitted",
        "reviewing",
        "interview",
        "offer",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      employment_type: [
        "full_time",
        "part_time",
        "contract",
        "freelance",
        "internship",
        "temporary",
      ],
      job_outcome: ["approved", "rejected", "withdrawn"],
      lead_source: [
        "contact_form",
        "whitepaper_download",
        "newsletter_signup",
        "chatbot",
      ],
      leadership_group: ["founder", "executive", "vp", "director", "advisor"],
      meeting_status: [
        "requested",
        "confirmed",
        "completed",
        "cancelled",
        "onboarding",
      ],
      news_kind: ["blog", "trend", "whitepaper", "client_story", "press"],
      notification_kind: ["job", "application", "info", "alert"],
      offer_letter_status: ["sent", "signed", "accepted"],
      onboarding_document_status: ["sent", "signed", "accepted", "rejected"],
      talent_source: ["direct_application", "auto_match"],
      talent_status: ["pending", "accepted", "rejected"],
      ticket_category: [
        "billing",
        "technical",
        "job_listing",
        "account",
        "other",
      ],
      ticket_priority: ["low", "normal", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["admin", "customer", "recruiter", "applicant"],
      user_status: ["active", "invited", "suspended", "deactivated"],
    },
  },
} as const
