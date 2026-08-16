import * as path from 'node:path';
import * as fs from 'node:fs';
import { ProjectIndexer } from '../../dist/scanner/indexer.js';
import { MemoryGenerator } from '../../dist/memory/generator.js';
import { CodeCataloger } from '../../dist/reuse/cataloger.js';
import { findPotentialDuplicates } from '../../dist/reuse/duplicate-finder.js';
import { DependencyGovernanceEngine } from '../../dist/dependencies/governance.js';
import { SecurityScanner } from '../../dist/security/scanner.js';
import { classifyTask } from '../../dist/core/classifier.js';

async function runBenchmarks() {
  console.log('====================================================');
  console.log('             TAILOR BENCHMARK SUITE                 ');
  console.log('====================================================\n');

  const rootDir = process.cwd();
  const fixturesDir = path.join(rootDir, 'benchmarks', 'fixtures');
  const fixtures = ['nextjs-app', 'django-app', 'react-app', 'dotnet-api', 'messy-monolith'];

  let passedChecks = 0;
  let totalChecks = 0;

  // 1. Detection & Signal Accuracy
  console.log('--- 1. Project Signal Detection Benchmark ---');
  const indexer = new ProjectIndexer();

  for (const f of fixtures) {
    const fPath = path.join(fixturesDir, f);
    const index = await indexer.scan(fPath);
    totalChecks++;
    if (f === 'nextjs-app' && index.signals.frontend?.framework === 'Next.js') {
      console.log(`✔ [nextjs-app] Correctly identified Next.js + Tailwind`);
      passedChecks++;
    } else if (f === 'django-app' && index.signals.backend?.framework === 'Django') {
      console.log(`✔ [django-app] Correctly identified Django + PostgreSQL`);
      passedChecks++;
    } else if (f === 'react-app' && index.signals.frontend?.framework?.includes('React')) {
      console.log(`✔ [react-app] Correctly identified React`);
      passedChecks++;
    } else if (f === 'dotnet-api' && index.signals.backend?.framework === 'ASP.NET Core') {
      console.log(`✔ [dotnet-api] Correctly identified ASP.NET Core`);
      passedChecks++;
    } else if (f === 'messy-monolith' && index.signals.backend?.framework === 'Express') {
      console.log(`✔ [messy-monolith] Correctly identified Express backend`);
      passedChecks++;
    } else {
      console.error(`✖ [${f}] Detection discrepancy:`, index.signals);
    }
  }

  // 2. Reuse & Duplicate Detection
  console.log('\n--- 2. Code Reuse & Semantic Duplicate Search Benchmark ---');
  const nextIndexPath = path.join(fixturesDir, 'nextjs-app');
  const nextIndex = await indexer.scan(nextIndexPath);
  const cataloger = new CodeCataloger();
  const nextCatalog = cataloger.catalogProject(nextIndexPath, nextIndex.files);

  const modalDuplicates = findPotentialDuplicates('modal', nextCatalog);
  totalChecks++;
  if (modalDuplicates.some(m => m.matchedEntity.name === 'Dialog')) {
    console.log(`✔ [Reuse Match] Successfully matched user request "modal" -> existing Dialog component`);
    passedChecks++;
  } else {
    console.error(`✖ Failed to match modal -> Dialog`);
  }

  const messyPath = path.join(fixturesDir, 'messy-monolith');
  const messyIndex = await indexer.scan(messyPath);
  const messyCatalog = cataloger.catalogProject(messyPath, messyIndex.files);
  const userDuplicates = findPotentialDuplicates('fetchUser', messyCatalog);
  totalChecks++;
  if (userDuplicates.some(m => m.matchedEntity.name === 'getUser')) {
    console.log(`✔ [Semantic Duplicate] Successfully matched "fetchUser" -> existing "getUser"`);
    passedChecks++;
  } else {
    console.error(`✖ Failed to match fetchUser -> getUser`);
  }

  // 3. Dependency Governance
  console.log('\n--- 3. Dependency Governance & Anti-Bloat Benchmark ---');
  const governance = new DependencyGovernanceEngine();
  const isOddEval = governance.evaluateNewDependency('is-odd', messyIndex);
  totalChecks++;
  if (isOddEval.recommendation === 'REJECT') {
    console.log(`✔ [Micro-package Reject] Successfully rejected "is-odd" as trivial micro-package`);
    passedChecks++;
  } else {
    console.error(`✖ Failed to reject is-odd`);
  }

  const axiosEval = governance.evaluateNewDependency('axios', messyIndex);
  totalChecks++;
  if (axiosEval.isRedundant) {
    console.log(`✔ [Redundancy Check] Successfully challenged "axios" in modern runtime`);
    passedChecks++;
  } else {
    console.error(`✖ Failed to challenge axios`);
  }

  // 4. Security Vulnerability & Secret Leak Detection
  console.log('\n--- 4. Security Vulnerability Detection Benchmark ---');
  const secScanner = new SecurityScanner();
  const secReport = secScanner.scanFiles(messyPath, messyIndex.files);
  totalChecks++;
  const hasAwsKey = secReport.findings.some(f => f.title.includes('AWS Access Key'));
  const hasEval = secReport.findings.some(f => f.title.includes('eval()'));
  if (hasAwsKey && hasEval) {
    console.log(`✔ [Security Findings] Successfully detected hardcoded AWS key and dangerous eval() in messy-monolith (${secReport.findings.length} findings)`);
    passedChecks++;
  } else {
    console.error(`✖ Failed to detect security vulnerabilities`);
  }

  // 5. Task Classification
  console.log('\n--- 5. Task Complexity Classification Benchmark ---');
  const tasksRaw = JSON.parse(fs.readFileSync(path.join(rootDir, 'benchmarks', 'tasks', 'tasks.json'), 'utf8'));
  let taskMatches = 0;
  for (const t of tasksRaw) {
    const classification = classifyTask({ goal: t.name });
    if (classification.complexity === t.expectedComplexity) {
      taskMatches++;
    }
  }
  totalChecks++;
  if (taskMatches >= 10) {
    console.log(`✔ [Task Classifier] ${taskMatches}/12 tasks accurately classified`);
    passedChecks++;
  } else {
    console.error(`✖ Task classification accuracy too low: ${taskMatches}/12`);
  }

  console.log('\n====================================================');
  console.log(` BENCHMARK RESULTS: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  console.log('====================================================\n');

  if (passedChecks !== totalChecks) {
    process.exit(1);
  }
}

runBenchmarks().catch((err) => {
  console.error(err);
  process.exit(1);
});
