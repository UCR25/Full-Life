# CS180-Project
made it in .sh file executables to be more portable (.bat is only windows)

./setup.sh (Removes orphans then builds it no cache)
./run.sh (Starts detached docker and starts the website manually. When finished, press control+c in vscode terminal to exit the docker gracefully)

for easy runs make sure your terminal is in git bash!

for right now its local host but if we want to get it "online" we can use the tailscale private ip and all of us can connect to it