$raw = Get-Content 'D:\1.library\metadata.json' -Raw -Encoding UTF8
$idx = $raw.IndexOf('年会礼品合计')
if ($idx -ge 0) {
    Write-Host "Found at index: $idx"
    $start = [Math]::Max(0, $idx - 50)
    Write-Host $raw.Substring($start, 200)
} else {
    Write-Host 'Not found'
}
