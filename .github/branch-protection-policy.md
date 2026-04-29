# Branch protection and CI/CD enforcement configuration
# This file documents the recommended GitHub settings for branch protection

# Apply these settings via GitHub repository:
# Settings > Branches > Add rule

branch_protection:
  pattern: main
  
  # Require status checks
  require_status_checks:
    strict: true  # Require branches to be up to date before merging
    contexts:
      - Backend Tests & Linting
      - Frontend Tests & Build
      - Security Scanning
      - Docker Build & Push

  # Require pull request reviews
  require_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
    require_code_owner_reviews: true

  # Require conversation resolution
  require_conversation_resolution: true

  # Restrict who can push
  restrict_pushes:
    allows_deletions: false
    allows_force_pushes: false

  # Require linear history (no merge commits)
  require_linear_history: false  # Allow merge commits

  # Allow auto-merge
  allow_auto_merge: true

# Recommended additional configuration:
# - Enable "Require branches to be up to date before merging"
# - Enable "Require status checks to pass before merging"
# - Enable "Restrict who can push to matching branches"
# - Add "CODEOWNERS" file for review requirements
