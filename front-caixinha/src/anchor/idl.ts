/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/caixinha_dapp.json`.
 */
export type CaixinhaDapp = {
    "address": "Do72vP6pm2g9UDAy8mhP7LrEPoHD4c5SQXacbrQ2aoDv",
    "metadata": {
      "name": "caixinhaDapp",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "createCaixinha",
        "discriminator": [
          92,
          39,
          65,
          27,
          74,
          129,
          177,
          75
        ],
        "accounts": [
          {
            "name": "caixinha",
            "writable": true,
            "signer": true
          },
          {
            "name": "authority",
            "writable": true,
            "signer": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "desc",
            "type": "string"
          },
          {
            "name": "refId",
            "type": "string"
          }
        ]
      },
      {
        "name": "deposit",
        "discriminator": [
          242,
          35,
          198,
          137,
          82,
          225,
          242,
          182
        ],
        "accounts": [
          {
            "name": "caixinha",
            "writable": true
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "f32"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "caixinha",
        "discriminator": [
          58,
          7,
          87,
          126,
          210,
          119,
          18,
          79
        ]
      }
    ],
    "types": [
      {
        "name": "caixinha",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "desc",
              "type": "string"
            },
            {
              "name": "refId",
              "type": "string"
            },
            {
              "name": "amount",
              "type": "f32"
            },
            {
              "name": "depositsCount",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "pubkey"
            }
          ]
        }
      }
    ]
  };
  