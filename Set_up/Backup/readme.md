# Before backing up data, make sure that everything is set up correctly. See the readme in the Set_up folder.

#  1. Get all data
Run script getDataFromAllDatabases.sh to fetch all documents from all databases.

# 2. Transform data
Run script transformData.sh to transform data to a format that can be imported into a new database.

# 3. (Only if data needs to be restored) Import data into a new database
Run script importData.sh to import data into a new database.

# 4. Backup data on git server (github.com)
- Create a new PRIVATE repository on github.com
- Add ssh key from baremetal server to github so no login is required
  when commiting to the repository
- Add the repository as a remote to the local repository (git remote add originsSsh)
- Add a cron job to run the script getDataFromAllDatabases.sh every day at 11:00 p.m.
```bash
crontab -e
```
- Add the following lines to the file:
```
0 23 * * * /backup/getDataFromDatabases.sh
10 23 * * * /backup/transformData.sh
10 23 * * * /backup/pushGit.sh
```