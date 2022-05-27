# File-Diff javascript action

PRから呼び出すことで、特定のファイルの変更がそのPRに含まれているかを判定するAction。
結果はPRへのCommentで提示します

## Inputs

## `target`

**Required** 変更を確認したいターゲットのファイル名。 Defaultは `"README.md"`.

## Outputs

## `isChanged`

指定したファイルが変更されていたかの結果。
Bool値で返ります。

## Example usage

      - uses: k-shinn/file-diff@master
        with:
          target: 'README.md'
