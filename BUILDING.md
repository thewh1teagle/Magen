# Building

Prepare

```console
cd core
docker buildx build --platform=linux/amd64 -t thewh1teagle/magen-srv .
docker push thewh1teagle/magen-srv
```

Deploy

```console
docker compose down
docker pull thewh1teagle/magen-srv
docker compose up -d
```
