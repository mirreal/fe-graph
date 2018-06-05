# 重写 commit

## example

```sh
git filter-branch --commit-filter '
  if [ "$GIT_AUTHOR_EMAIL" = "yran@xxxxx.com" ];
  then
          GIT_AUTHOR_NAME="mirreal";
          GIT_AUTHOR_EMAIL="exileduyi@xxxx.com";
          git commit-tree "$@";
  else
          git commit-tree "$@";
  fi' HEAD
```