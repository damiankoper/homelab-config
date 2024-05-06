# Welcome to my Homelab
Nie interesuj sie bo kociej mordy dostaniesz

```
ansible-galaxy install -r requirements.yml
ansible-playbook -i inventory.yml playbook_frog.yml --ask-vault-pass
ansible-playbook -i inventory.yml playbook_homelab.yml --ask-vault-pass
ansible-playbook -i inventory.yml playbook.yml --ask-vault-pass
```
