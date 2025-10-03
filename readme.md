# POO with Typescript

This is a simple example of a bank account with a cash box.

## Features

- Deposit cash
- Withdraw cash
- Get total cash
- Get cash box
- Get notifications

## Examples

- ### Part 1

```ts 
import {banco} from "./caixa"; // ajuste o caminho do arquivo .ts

const caixa = new banco.Caixa();

// consulta inicial
console.log("Total inicial:", caixa.GetTotal()); // 0

// deposita algumas notas
caixa.Depositar({cinquenta: 2, dez: 3});
// console vai mostrar notificação
console.log("Total após depósito:", caixa.GetTotal()); // 130
```

- ### Part 2

```ts
const caixa2 = new banco.Caixa();
caixa2.Depositar({cem: 1, vinte: 2, dez: 3}); // total 160

console.log("Saque de 140:", caixa2.Sacar(140));
```

- ### Part 3

```ts
const caixa3 = new banco.Caixa();
const logger = new (class implements banco.Notificar {
    Registrar(msg: string): void {
        console.log("LOGGER:", msg);
    }
})();
caixa3.AddNotificador(logger);

caixa3.Depositar({cinquenta: 1});
caixa3.Sacar(50);
```

- ### Part 4

```ts
const caixa4 = new banco.Caixa();
caixa4.Depositar({cinquenta: 2}); // total = 100

console.log("Saque de 70:", caixa4.Sacar(70));
console.log("Saque de 100:", caixa4.Sacar(100));
```