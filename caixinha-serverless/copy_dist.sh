#!/bin/bash

# Define as pastas de origem e destino
origem="/home/jeanluca_pereira/Documents/GitHub/caixinha-core/dist"
destino="/home/jeanluca_pereira/Documents/GitHub/quem-me-segue/caixinha-serverless/node_modules/caixinha-core/dist"

# Faz a cópia dos arquivos, substituindo os existentes
cp -r -f $origem/. $destino/