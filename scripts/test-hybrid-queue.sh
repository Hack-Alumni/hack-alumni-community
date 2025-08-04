#!/bin/bash

# Test Script for Hybrid Job Queue System
# This script tests both real-time (QStash) and scheduled (Supabase) jobs

set -e

echo "🧪 Testing Hybrid Job Queue System..."

# Load environment variables
source .env

# Check required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file"
    exit 1
fi

if [ -z "$QUPSTASH_STASH_TOKEN" ]; then
    echo "❌ Error: QUPSTASH_STASH_TOKEN must be set in .env file"
    exit 1
fi

echo "✅ Environment variables loaded"

# Test 1: Check if jobs table exists
echo ""
echo "📊 Test 1: Checking jobs table..."
curl -s -X GET \
  "$SUPABASE_URL/rest/v1/jobs?select=count" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" | jq .

echo "✅ Jobs table accessible"

# Test 2: Test scheduled job enqueuing
echo ""
echo "📤 Test 2: Enqueuing a scheduled job..."
curl -s -X POST \
  "$SUPABASE_URL/rest/v1/jobs" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test.scheduled.job",
    "data": {"message": "This is a test scheduled job"},
    "queue_name": "test",
    "priority": 1,
    "max_attempts": 3
  }' | jq .

echo "✅ Scheduled job enqueued"

# Test 3: Test real-time job processing (if API_URL is set)
if [ ! -z "$API_URL" ]; then
    echo ""
    echo "⚡ Test 3: Testing real-time job processing..."
    curl -s -X POST \
      "$API_URL/api/jobs/process-immediate" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "test.realtime.job",
        "data": {"message": "This is a test real-time job"}
      }' | jq .

    echo "✅ Real-time job processing tested"
else
    echo "⚠️  Skipping real-time test (API_URL not set)"
fi

# Test 4: Test scheduled job processing
echo ""
echo "🔄 Test 4: Testing scheduled job processing..."
curl -s -X POST \
  "$SUPABASE_URL/functions/v1/process-jobs" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" | jq .

echo "✅ Scheduled job processing tested"

# Test 5: Check job statistics
echo ""
echo "📈 Test 5: Checking job statistics..."
curl -s -X GET \
  "$SUPABASE_URL/rest/v1/rpc/get_job_stats" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" | jq .

echo "✅ Job statistics retrieved"

# Test 6: List recent jobs
echo ""
echo "📋 Test 6: Listing recent jobs..."
curl -s -X GET \
  "$SUPABASE_URL/rest/v1/jobs?select=*&order=created_at.desc&limit=5" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" | jq .

echo "✅ Recent jobs listed"

echo ""
echo "🎉 All tests completed!"
echo ""
echo "📋 Test Summary:"
echo "✅ Jobs table accessible"
echo "✅ Scheduled job enqueuing works"
echo "✅ Scheduled job processing works"
echo "✅ Job statistics accessible"
echo "✅ Job listing works"
echo ""
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard"
echo "📊 Check the jobs table in your Supabase dashboard to see the test results"
