
# Currently workspaces
The currently workspaces can be downloaded either by Kasm Registry or directly from the docker pull (available at https://hub.docker.com/u/aborsatto).
All images were created using kasm images as bases. 

## CherryTree:
Created using the kasm/sublime-text:1.15.0 image as base image. 

### Dokerfile
```
FROM kasmweb/sublime-text:1.15.0
LABEL maintainer="borsatto at mail dot com"

USER root

# Installing cherrytree
RUN add-apt-repository -y ppa:giuspen/ppa && apt update -y && apt install -y cherrytree

# Removing sublime and other unnecessary pkgs
RUN apt -y remove sublime-text && apt autoremove -y

#Editing the startup script
RUN sed -i 's|/opt/sublime_text/sublime_text|/usr/bin/cherrytree|' /dockerstartup/custom_startup.sh
RUN sed -i 's/sublime_text/cherrytree/'  /dockerstartup/custom_startup.sh
RUN sed -i 's/Sublime/CherryTree/' /dockerstartup/custom_startup.sh
```

## Obsidian:
Created using the kasm/sublime-text:1.15.0 image as base image. 

### Dokerfile
```
FROM kasmweb/sublime-text:1.15.0
LABEL maintainer="borsatto at mail dot com"

USER root

# Installing prerequisites
RUN apt update
RUN apt-get install -y --no-install-recommends curl libgtk-3-0 libnotify4 libatspi2.0-0 libsecret-1-0 libnss3 desktop-file-utils fonts-noto-color-emoji git ssh-askpass
RUN apt install -y xdg-utils

# Installing obsidian
RUN wget https://github.com/obsidianmd/obsidian-releases/releases/download/v1.6.3/obsidian_1.6.3_amd64.deb
RUN dpkg -i obsidian_1.6.3_amd64.deb
RUN rm obsidian_1.6.3_amd64.deb

# Removing sublime and other unnecessary pkgs
RUN apt -y remove sublime-text && apt autoremove -y

# Editing the startup script
RUN sed -i 's|/opt/sublime_text/sublime_text|/usr/bin/obsidian --no-sandbox --no-xshm --disable-dev-shm-usage --disable-gpu --disable-software-rasterizer/|' /dockerstartup/custom_startup.sh
RUN sed -i 's/sublime_text/obsidian/'  /dockerstartup/custom_startup.sh
RUN sed -i 's/Sublime/Obsidian/' /dockerstartup/custom_startup.sh
```

## Firefox (with ublock origin):
Created using the kasm/firefox:1.15.0 image as base image. 
For this particular image, I just ran the base image, installed the ublock origin plugin and created a new image from the running container. You can learn more about creating images from running containers consulting the official docker documentation (https://docs.docker.com).

## enhanced-terminal:
Created using the kasm/sublime-text:1.15.0 image as base image. 

### Dokerfile
```
FROM kasmweb/sublime-text:1.15.0
LABEL maintainer="borsatto at mail dot com"

USER root

# Kasm 
ENV HOME /home/kasm-default-profile
ENV STARTUPDIR /dockerstartup
ENV INST_SCRIPTS $STARTUPDIR/install
WORKDIR $HOME

# Download / Install Microsoft Repo
RUN wget -q https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN rm packages-microsoft-prod.deb

# Download / Install eza Repo
RUN apt install -y gpg
RUN mkdir -p /etc/apt/keyrings
RUN wget -qO- https://raw.githubusercontent.com/eza-community/eza/main/deb.asc | sudo gpg --dearmor -o /etc/apt/keyrings/gierens.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/gierens.gpg] http://deb.gierens.de stable main" | sudo tee /etc/apt/sources.list.d/gierens.list
RUN chmod 644 /etc/apt/keyrings/gierens.gpg /etc/apt/sources.list.d/gierens.list

# Updating the pkgs list
RUN apt update

# Installing the new pkgs
RUN apt-get install -y powershell eza fzf

# Removing any unecessary pkgs
RUN apt remove -y remmina nextcloud-desktop gimp obs-studio thunderbird vlc slack
RUN apt update
RUN apt autoremove -y

# Installing most used Powershell modules
RUN pwsh -Command Install-Module VMware.PowerCLI -Force
RUN pwsh -Command Install-Module -Name Az -Repository PSGallery -Force
RUN pwsh -Command Install-Module -Name AWS.Tools.Installer -Force

# Upgrading pkgs and ensuring the non-necessary pkgs will be removed
RUN apt upgrade -y
RUN apt autoremove -y

# Copying the modified custom_startup.sh (from kasm/terminal:1.15.0)
COPY custom_startup.sh /dockerstartup/custom_startup.sh
RUN chmod +x /dockerstartup/custom_startup.sh

# More Kasm 
RUN chown 1000:0 $HOME
RUN $STARTUPDIR/set_user_permission.sh $HOME
ENV HOME /home/kasm-user
WORKDIR $HOME
RUN mkdir -p $HOME && chown -R 1000:0 $HOME
USER 1000

# Copying modified .bashrc file to the default profile home dir
COPY .bashrc /home/kasm-default-profile/
```
