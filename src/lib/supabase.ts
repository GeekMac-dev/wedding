import { createClient } from '@supabase/supabase-js';


// Initialize database client
// const supabaseUrl = 'https://qrcsvkcvrdnzeriqzfmb.databasepad.com';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgyM2QwYjg4LWUzNTgtNDZiOS05NTI2LTJiMGJjMzIzZTViOCJ9.eyJwcm9qZWN0SWQiOiJxcmNzdmtjdnJkbnplcmlxemZtYiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY3NzQ2NTQ4LCJleHAiOjIwODMxMDY1NDgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.H_FvQPMTiGkAm2O1NrQ3Ifl_2hRUd0py5wugIfKOfHo';
// const supabase = createClient(supabaseUrl, supabaseKey);

const supabaseUrl = 'https://gxqjkgwzfpztzrmkfnhm.supabase.co';
const supabaseKey = 'sb_publishable_-d_WhYrQ-ogKDvUweQoZzQ_SyZhZFCU';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };