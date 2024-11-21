#!/bin/bash
LOCALE="/var/www/html/plus/archive/"
PLUS="/mnt/lund/plus/archive/"
DEV="/mnt/lund/prototype_dev/archive/"
echo "sincronizzo la cartella locale con /mnt/lund/plus/"
rsync -varzhP  $LOCALE $PLUS
echo "sincronizzazione con la cartella /mnt/lund/plus/ terminata"

echo "sincronizzo la cartella /mnt/lund/plus/ con /mnt/lund/prototype_dev/"
rsync -varzhP $PLUS $DEV
echo "Seconda operazione di rsync completata."

echo "sincronizzo la cartella /mnt/lund/prototype_dev/ con /mnt/lund/plus/"
rsync -varzhP $DEV $PLUS
echo "Seconda operazione di rsync completata."

echo "sincronizzo /mnt/lund/plus/ con la cartella locale"
rsync -varzhP $PLUS $LOCALE
echo "Terza operazione di rsync completata. Log salvato in $LOG3"

echo "Tutte le operazioni di rsync sono state completate con successo."
