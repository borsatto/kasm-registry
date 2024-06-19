
# Currently workspaces
The currently workspaces can be downloaded either by Kasm Registry or directly from the docker pull (available at https://hub.docker.com/u/aborsatto).
All images were created using kasm images as bases. 


## ![cherrytree](https://github.com/borsatto/kasm-registry/assets/14880143/6bc6e3f5-98c9-4dd9-995a-d6da6b9496d6) CherryTree:
Created using the kasm/sublime-text:1.15.0 image as base image. 

#### Dokerfile
```dockerfile
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

## ![obsidian](https://github.com/borsatto/kasm-registry/assets/14880143/ce41b101-14b6-4165-833f-8509095f7de6) Obsidian:
Created using the kasm/sublime-text:1.15.0 image as base image. 

#### Dokerfile
```dockerfile
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

## ![firefox-ublockorigin](https://github.com/borsatto/kasm-registry/assets/14880143/70d0707d-e721-4479-8cea-e82d42628f8e) Firefox (with ublock origin):
Created using the kasm/firefox:1.15.0 image as base image. 
For this particular image, I just ran the base image, installed the ublock origin plugin and created a new image from the running container. You can learn more about creating images from running containers consulting the official docker documentation (https://docs.docker.com).

## <img width="48" alt="enhanced-terminal" src="https://github.com/borsatto/kasm-registry/assets/14880143/e1c50146-dce7-429a-9b73-0b8737e56fdb"> enhanced-terminal:
Created using the kasm/sublime-text:1.15.0 image as base image. 

#### Dokerfile
```dockerfile
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

# Removing any unnecessary pkgs
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
#### custom_startup.sh
```bash
#!/usr/bin/env bash
set -ex
START_COMMAND="xfce4-terminal"
PGREP="xfce4-terminal"
export MAXIMIZE="true"
export MAXIMIZE_NAME="Enhanced Terminal"
MAXIMIZE_SCRIPT=$STARTUPDIR/maximize_window.sh
DEFAULT_ARGS="--hide-borders --hide-menubar --hide-scrollbar --fullscreen"
ARGS=${APP_ARGS:-$DEFAULT_ARGS}

options=$(getopt -o gau: -l go,assign,url: -n "$0" -- "$@") || exit
eval set -- "$options"

while [[ $1 != -- ]]; do
    case $1 in
        -g|--go) GO='true'; shift 1;;
        -a|--assign) ASSIGN='true'; shift 1;;
        -u|--url) OPT_URL=$2; shift 2;;
        *) echo "bad option: $1" >&2; exit 1;;
    esac
done
shift

# Process non-option arguments.
for arg; do
    echo "arg! $arg"
done

FORCE=$2

kasm_exec() {
    if [ -n "$OPT_URL" ] ; then
        URL=$OPT_URL
    elif [ -n "$1" ] ; then
        URL=$1
    fi

    # Since we are execing into a container that already has the browser running from startup,
    #  when we don't have a URL to open we want to do nothing. Otherwise a second browser instance would open.
    if [ -n "$URL" ] ; then
        /usr/bin/filter_ready
        /usr/bin/desktop_ready
        bash ${MAXIMIZE_SCRIPT} &
        $START_COMMAND $ARGS $OPT_URL
    else
        echo "No URL specified for exec command. Doing nothing."
    fi
}

kasm_startup() {
    if [ -n "$KASM_URL" ] ; then
        URL=$KASM_URL
    elif [ -z "$URL" ] ; then
        URL=$LAUNCH_URL
    fi

    if [ -z "$DISABLE_CUSTOM_STARTUP" ] ||  [ -n "$FORCE" ] ; then

        echo "Entering process startup loop"
        set +x
        while true
        do
            if ! pgrep -x $PGREP > /dev/null
            then
                /usr/bin/filter_ready
                /usr/bin/desktop_ready
                set +e
                bash ${MAXIMIZE_SCRIPT} &
                cd $HOME
                $START_COMMAND $ARGS $URL
                set -e
            fi
            sleep 1
        done
        set -x

    fi

}

if [ -n "$GO" ] || [ -n "$ASSIGN" ] ; then
    kasm_exec
else
    kasm_startup
fi
```

#### .bashrc
Feel free to modify the content of .bashrc to meet your needs.
```bash
# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
#shopt -s globstar

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
case "$TERM" in
    xterm-color|*-256color) color_prompt=yes;;
esac

# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
#force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
        # We have color support; assume it's compliant with Ecma-48
        # (ISO/IEC-6429). (Lack of such support is extremely rare, and such
        # a case would tend to support setf rather than setaf.)
        color_prompt=yes
    else
        color_prompt=
    fi
fi

if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;31m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi
unset color_prompt force_color_prompt

# If this is an xterm set the title to user@host:dir
case "$TERM" in
xterm*|rxvt*)
    PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
    ;;
*)
    ;;
esac

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# colored GCC warnings and errors
#export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'

# some more ls aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi
alias dir='eza --color=always --long --git --no-filesize --icons=always --no-time --no-user --no-permissions'
alias details='eza --color=always --long --git'
alias ll=details
alias ls=dir

# Improving copy and move
alias cp="cp -iv"
alias mv="mv -iv"

# Better copying
alias cpv="rsync -avh --info=progress2"

# Improving cd
alias cd..="cd .."
#Counting 
alias count="ls * | wc -l"

# Disk usage 1 level
alias du1="du -h --max-depth=1"

# Search strings in text files (function)
fstr() {
        grep -Rnw "." -e "$1"
}

# function Extract for common file formats
#
# This is a Bash function called "extract" that is designed to extract a variety of file formats.
# It takes one or more arguments, each of which represents a file or path that needs to be extracted.
# If no arguments are provided, the function displays usage instructions.
#
# This bash script allows to download a file from Github storage https://github.com/xvoland/Extract/blob/master/extract.sh
#
# Usage:
#     extract <path/file_name>.<zip|rar|bz2|gz|tar|tbz2|tgz|Z|7z|xz|ex|tar.bz2|tar.gz|tar.xz|.zlib|.cso|.zst>
#
# Example:
# $ extract file_name.zip
#
# Author: Vitalii Tereshchuk, 2013
# Web:    https://dotoca.net
# Github: https://github.com/xvoland/Extract/blob/master/extract.sh

SAVEIFS=$IFS
IFS="$(printf '\n\t')"

function extract {
 if [ $# -eq 0 ]; then
    # display usage if no parameters given
    echo "Usage: extract <path/file_name>.<zip|rar|bz2|gz|tar|tbz2|tgz|Z|7z|xz|ex|tar.bz2|tar.gz|tar.xz|.zlib|.cso|.zst>"
    echo "       extract <path/file_name_1.ext> [path/file_name_2.ext] [path/file_name_3.ext]"
 fi
    for n in "$@"; do
        if [ ! -f "$n" ]; then
            echo "'$n' - file doesn't exist"
            return 1
        fi

        case "${n%,}" in
          *.cbt|*.tar.bz2|*.tar.gz|*.tar.xz|*.tbz2|*.tgz|*.txz|*.tar)
                       tar zxvf "$n"       ;;
          *.lzma)      unlzma ./"$n"      ;;
          *.bz2)       bunzip2 ./"$n"     ;;
          *.cbr|*.rar) unrar x -ad ./"$n" ;;
          *.gz)        gunzip ./"$n"      ;;
          *.cbz|*.epub|*.zip) unzip ./"$n"   ;;
          *.z)         uncompress ./"$n"  ;;
          *.7z|*.apk|*.arj|*.cab|*.cb7|*.chm|*.deb|*.iso|*.lzh|*.msi|*.pkg|*.rpm|*.udf|*.wim|*.xar|*.vhd)
                       7z x ./"$n"        ;;
          *.xz)        unxz ./"$n"        ;;
          *.exe)       cabextract ./"$n"  ;;
          *.cpio)      cpio -id < ./"$n"  ;;
          *.cba|*.ace) unace x ./"$n"     ;;
          *.zpaq)      zpaq x ./"$n"      ;;
          *.arc)       arc e ./"$n"       ;;
          *.cso)       ciso 0 ./"$n" ./"$n.iso" && \
                            extract "$n.iso" && \rm -f "$n" ;;
          *.zlib)      zlib-flate -uncompress < ./"$n" > ./"$n.tmp" && \
                            mv ./"$n.tmp" ./"${n%.*zlib}" && rm -f "$n"   ;;
          *.dmg)
                      hdiutil mount ./"$n" -mountpoint "./$n.mounted" ;;
          *.tar.zst)  tar -I zstd -xvf ./"$n"  ;;
          *.zst)      zstd -d ./"$n"  ;;
          *)
                      echo "extract: '$n' - unknown archive method"
                      return 1
                      ;;
        esac
    done
}

IFS=$SAVEIFS
```
