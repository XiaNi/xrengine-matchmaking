# xrengine-matchmaking

# Install the core Open Match services.
```
kubectl apply --namespace open-match \
-f https://open-match.dev/install/v1.3.0-rc.1/yaml/01-open-match-core.yaml
```

# local development
```
minikube start
eval $(minikube docker-env)
```

```
open-match-custom-pods/build.sh matchfunction
sed "s|REGISTRY_PLACEHOLDER|$REGISTRY|g" open-match-custom-pods/matchfunction/matchfunction.yaml | sed "s|Always|Never|g" | kubectl apply -f -

open-match-custom-pods/build.sh director
sed "s|REGISTRY_PLACEHOLDER|$REGISTRY|g" open-match-custom-pods/director/director.yaml | sed "s|Always|Never|g" | kubectl apply -f -
```

```
kubectl port-forward --namespace open-match service/open-match-frontend 51504:51504
```

delete custom pods
```
kubectl -n xrengine-matchmaking delete pod,svc --all
```