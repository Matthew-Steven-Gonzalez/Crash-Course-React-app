
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vfmozptpadnkckfsiviv.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbW96cHRwYWRua2NrZnNpdml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMzNDg4MDIsImV4cCI6MjAwODkyNDgwMn0.h83eFCcAUxXW2ZGPuoyGpXbvU4SdB3RuXe7kLEf_xJ4"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase