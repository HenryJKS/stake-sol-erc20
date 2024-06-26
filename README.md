# Contrato de Staking

## Descrição

Este contrato permite que os usuários façam staking do token `myToken`. Os usuários podem fazer stake de seus tokens, retirar seus tokens e reivindicar recompensas com base no tempo que seus tokens permaneceram em stake.

## Funções

### stake()

Os usuários podem fazer stake de seus tokens usando a função `stake`. A quantidade de tokens a serem staked é passada como argumento. A função verifica se o usuário tem saldo suficiente para fazer o stake.

### unstaked()

Os usuários podem retirar seus tokens staked usando a função `unstaked`. A quantidade de tokens a serem unstaked é passada como argumento. A função verifica se o usuário tem tokens suficientes em stake para fazer a retirada.

### policyRewardsperToken()

Esta função calcula a recompensa de um usuário com base no tempo que seus tokens permaneceram em stake. A recompensa é calculada como 2% do saldo staked a cada 30 segundos.

### claimRewards()

Os usuários podem reivindicar suas recompensas usando a função `claimRewards`. A função verifica se o usuário tem alguma recompensa para reivindicar e, em seguida, transfere a recompensa para o usuário.

## Modificadores

### updateData()

Este modificador atualiza os dados de recompensa de um usuário sempre que uma ação é realizada. Ele é usado nas funções `stake`, `unstaked` e `claimRewards`.

### moreThen0()

Este modificador verifica se o saldo do usuário é maior que zero. Ele é usado na função `stake`.

## Eventos

Nenhum evento é emitido por este contrato.

---

### Truffle

Utilização da truffle para compilação dos contratos.
