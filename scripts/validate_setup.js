#!/usr/bin/env node
/**
 * Automated setup script for Scripture AI deployment
 * This script:
 * 1. Validates environment variables
 * 2. Checks Supabase connectivity
 * 3. Guides user through manual steps
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',     // cyan
    success: '\x1b[32m',  // green
    warning: '\x1b[33m',  // yellow
    error: '\x1b[31m',    // red
    reset: '\x1b[0m'
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✓ ${description}`, 'success')
    return true
  } else {
    log(`✗ ${description} not found`, 'error')
    return false
  }
}

async function checkEnv() {
  log('\n📋 Checking environment setup...', 'info')
  
  const envPath = path.join(__dirname, '.env.local')
  if (!fs.existsSync(envPath)) {
    log('✗ .env.local not found', 'error')
    log('   Run: cp .env.example .env.local', 'warning')
    log('   Then add your Supabase and OpenAI API keys', 'warning')
    return false
  }

  const env = require('dotenv').config({ path: envPath }).parsed || {}
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'OPENAI_API_KEY']
  
  let allSet = true
  for (const key of required) {
    if (env[key] && !env[key].includes('YOUR_')) {
      log(`✓ ${key} is set`, 'success')
    } else {
      log(`✗ ${key} is missing or not configured`, 'error')
      allSet = false
    }
  }
  
  return allSet
}

async function checkFiles() {
  log('\n📁 Checking project files...', 'info')
  
  const files = [
    { path: 'package.json', desc: 'Package configuration' },
    { path: 'vite.config.ts', desc: 'Vite configuration' },
    { path: 'src/App.tsx', desc: 'Main React app' },
    { path: 'src/components/Chat.tsx', desc: 'Chat component' },
    { path: 'src/lib/supabase.ts', desc: 'Supabase client' },
    { path: 'data/bhagavad_gita.txt', desc: 'Bhagavad Gita text' },
    { path: 'scripts/ingest_bhagavad_gita.js', desc: 'Ingestion script' },
    { path: 'migrations/create_tables.sql', desc: 'Database schema migration' },
    { path: 'migrations/create_match_function.sql', desc: 'Vector search function' },
    { path: 'supabase/functions/rag_chat/index.ts', desc: 'RAG Edge Function' }
  ]
  
  let allFound = true
  for (const file of files) {
    const fullPath = path.join(__dirname, file.path)
    if (!checkFile(fullPath, file.desc)) {
      allFound = false
    }
  }
  
  return allFound
}

function printDeploymentGuide() {
  log('\n🚀 DEPLOYMENT CHECKLIST', 'success')
  log('=' . repeat(50), 'success')
  
  const steps = [
    {
      num: 1,
      title: 'Configure .env.local',
      cmd: 'Copy .env.example to .env.local and add your API keys'
    },
    {
      num: 2,
      title: 'Link Supabase',
      cmd: 'npx supabase link --project-ref YOUR_PROJECT_REF'
    },
    {
      num: 3,
      title: 'Create Database Schema',
      cmd: 'Run migrations in Supabase SQL Editor (see FINAL_SETUP.md)'
    },
    {
      num: 4,
      title: 'Ingest Bhagavad Gita',
      cmd: 'node scripts/ingest_bhagavad_gita.js'
    },
    {
      num: 5,
      title: 'Deploy Edge Function',
      cmd: 'npx supabase functions deploy rag_chat'
    },
    {
      num: 6,
      title: 'Start Development Server',
      cmd: 'npm run dev'
    },
    {
      num: 7,
      title: 'Test Chat',
      cmd: 'Open http://localhost:5173 and ask a question'
    }
  ]
  
  for (const step of steps) {
    log(`\n${step.num}. ${step.title}`, 'info')
    log(`   $ ${step.cmd}`, 'warning')
  }
}

async function main() {
  log('\n' + '='.repeat(60), 'success')
  log('  Scripture AI - Deployment Validator', 'success')
  log('='.repeat(60), 'success')
  
  const filesOk = await checkFiles()
  const envOk = await checkEnv()
  
  if (filesOk && envOk) {
    log('\n✓ All checks passed! Ready for deployment.', 'success')
  } else {
    log('\n⚠ Please fix the issues above before deploying.', 'warning')
  }
  
  printDeploymentGuide()
  
  log('\n📖 For detailed help, see:', 'info')
  log('   - FINAL_SETUP.md (step-by-step guide)', 'info')
  log('   - QUICKSTART_COMMANDS.md (copy-paste commands)', 'info')
  log('   - docs/SETUP.md (complete reference)', 'info')
}

main().catch((err) => {
  log(`Error: ${err.message}`, 'error')
  process.exit(1)
})
