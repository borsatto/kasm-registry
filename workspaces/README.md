
# Currently workspaces
The currently workspaces can be downloaded either by Kasm Registry or directly from the docker pull (available at https://hub.docker.com/u/aborsatto).
All images were created using kasm images as bases. 

## CherryTree:
Created using the kasm/sublime-text:1.15.0 image as base image. 

### Dokerfile
```
FROM kasmweb/sublime-text:1.15.0
LABEL maintainer="borsatto@mail.com"

USER root

#Installing cherrytree
RUN add-apt-repository -y ppa:giuspen/ppa && apt update -y && apt install -y cherrytree

#Removing sublime and other unnecessary pkgs
RUN apt -y remove sublime-text && apt autoremove -y

#Editing the startup script
RUN sed -i 's|/opt/sublime_text/sublime_text|/usr/bin/cherrytree|' /dockerstartup/custom_startup.sh
RUN sed -i 's/sublime_text/cherrytree/'  /dockerstartup/custom_startup.sh
RUN sed -i 's/Sublime/CherryTree/' /dockerstartup/custom_startup.sh
```
