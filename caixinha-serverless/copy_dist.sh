#!/bin/bash

cd /home/user/Documentos/GitHub/caixinha-core
npm run build

# Define as pastas de origem e destino
origem="/home/user/Documentos/GitHub/caixinha-core/dist"
destino="/home/user/Documentos/GitHub/mdm/caixinha/caixinha-serverless/node_modules/caixinha-core/dist"

# Faz a cópia dos arquivos, substituindo os existentes
cp -r -f $origem/. $destino/
echo "Arquivos copiados com sucesso!"