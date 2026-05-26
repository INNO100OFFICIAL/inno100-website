$raw = Get-Content 'D:\1.library\metadata.json' -Raw -Encoding UTF8
# Search for 年会
$idx = $raw.IndexOf([char]0x5E74 + [char]0x4F1A)  # 年会
if ($idx -ge 0) {
    Write-Host "Found at index: $idx"
    $start = [Math]::Max(0, $idx - 20)
    Write-Host $raw.Substring($start, 300)
} else {
    Write-Host 'Not found - listing all folder names:'
    # Extract all names
    $matches = [regex]::Matches($raw, '"name":"([^"]{2,30})"')
    foreach ($m in $matches) {
        Write-Host $m.Groups[1].Value
    }
}
