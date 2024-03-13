# MBank Parser
Simple parser for mapping `*.csv` files exported from mBank account. They are really awful and encoded in `windows-1250` (yuck!).
The files are mapped to format easily consumable by [Actual](https://actualbudget.org/).

Mapping from (LMAO XD):
```csv
#Data ksi�gowania;#Data operacji;#Opis operacji;#Tytu�;#Nadawca/Odbiorca;#Numer konta;#Kwota;#Saldo po operacji;
```

To:
```csv
date,payee,notes,amount
```

## Running
```bash
npm start
```