<#
  scripts/fix-dist-imports.ps1
  ----------------------------
  Finds relative imports in compiled JS under dist/ and appends ".js" where the matching .js file exists.
  Creates a .bak copy for any file it modifies.
  Run from project root (where dist/ lives).
#>

# Ensure we run from project root (file's location is not changed, we use current working dir)
Write-Host "Running fix-dist-imports.ps1 from: $(Get-Location)"

# Find all .js files under dist
# run from project root (where dist/ lives)
Get-ChildItem -Path dist -Recurse -Filter *.js | ForEach-Object {
  $file = $_.FullName
  $text = Get-Content $file -Raw -Encoding UTF8
  $changed = $false

  # find import ... from '...'
  [regex]$re = "(from\s+|import\s+.*?\s+from\s+)?['""](\.\.?\/[^'""]+)['""]"
  $new = $text
  $matches = $re.Matches($text)
  foreach ($m in $matches) {
    $rel = $m.Groups[2].Value
    # ignore imports that already end with .js, .json, .css, .node, or are package-like (no ./ or ../)
    if ($rel -match "\.js$|\.json$|\.node$|\.css$") { continue }
    # compute candidate .js path from the current file's dir
    $candidate = Join-Path ($_.DirectoryName) ($rel + ".js")
    if (Test-Path $candidate) {
      # replace only this occurrence (use regex-escaped rel)
      $escaped = [regex]::Escape($rel)
      $new = [regex]::Replace($new, "(['""])" + $escaped + "(['""])", "`$1" + $rel + ".js`$2", 1)
      $changed = $true
    }
  }

  if ($changed) {
    # backup original just in case
    Copy-Item -Path $file -Destination ($file + ".bak") -Force
    Set-Content -Path $file -Value $new -Encoding UTF8
    Write-Host "Patched $file"
  }
}

Write-Host "fix-dist-imports complete."
