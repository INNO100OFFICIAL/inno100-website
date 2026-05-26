$result = Invoke-RestMethod -Uri 'http://localhost:41595/api/library/info' -Method GET
$folders = $result.data.folders

function ListFolders {
    param($items, $indent)
    foreach ($f in $items) {
        Write-Host "$indent$($f.name) [$($f.id)]"
        if ($f.children -and $f.children.Count -gt 0) {
            ListFolders -items $f.children -indent "$indent  "
        }
    }
}

ListFolders -items $folders -indent ''
