FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN=true

RUN apt-get update
RUN apt-get upgrade

# Packages
RUN apt-get install --no-install-recommends -y \
    gpg \
    curl \
    wget \
    lsb-release \
    add-apt-key \
    ca-certificates \
    dumb-init \
    git \
    sudo \
    gdb \
    pkg-config \
    build-essential \
    apache2 \
    # Python SDK
    python3 \
    python-dev \
    python3-venv \
    python3-pip \
    python3-setuptools \
    pylint \
    # Java SDK
    default-jre-headless \
    default-jdk-headless \
    maven \
    gradle \
    # Code-Server
    libarchive-tools \
    openssl \
    locales \
    net-tools \
    && rm -rf /var/lib/apt/lists/*


RUN python3 -m pip install --upgrade setuptools \
    && python3 -m pip install wheel \
    && python3 -m pip install astar==0.9 \
    && python3 -m pip install dacite==1.0.0 \
    && python3 -m pip install pylint==2.3.1 \
    && python3 -m pip install Sphinx==2.1.1 \
    && python3 -m pip install sphinx-rtd-theme==0.4.3 \
    && python3 -m pip install sphinx-tabs==1.1.11 \
    && python3 -m pip install pycodestyle==2.5.0 \
    && python3 -m pip install autopep8==1.4.4




RUN localedef --i en_GB -c -f UTF-8 -A /usr/share/locale/locale.alias en_GB.UTF-8
ENV LANG=en_GB.UTF-8 \
    DISABLE_TELEMETRY=true \
    CODE_VERSION="2.1665-vsc1.39.2" \
    VSCODE_USER="/home/coder/.local/share/code-server/User" \
    VSCODE_EXTENSIONS="/home/coder/.local/share/code-server/extensions" \
    PROJ_DIR="/home/coder/project"

# Get Code Server and setup coder user
RUN curl -sL https://github.com/cdr/code-server/releases/download/${CODE_VERSION}/code-server${CODE_VERSION}-linux-x86_64.tar.gz | tar --strip-components=1 -zx -C /usr/local/bin code-server${CODE_VERSION}-linux-x86_64/code-server \
    && groupadd -r coder -g 1024 \
    && useradd -m -r coder -g coder -s /bin/bash \
    && echo "coder ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/nopasswd
USER coder

RUN mkdir -p ${VSCODE_USER}
COPY --chown=coder:coder settings.json /home/coder/.local/share/code-server/User/

WORKDIR ${PROJ_DIR}
USER root
RUN chmod 755 ${PROJ_DIR} \
    && chmod g+s ${PROJ_DIR}
# why doesn't --chown=coder:coder work below?
ADD  --chown=coder:coder build/project/java-contestant.tgz java-contestant
ADD  --chown=coder:coder build/project/python-contestant.tgz python-contestant
COPY --chown=coder:coder build/project/run.sh .



RUN chown -R coder:coder java-contestant \
    && chown -R coder:coder python-contestant \
    && chmod 755 run.sh
USER coder



ENTRYPOINT ["./run.sh"]

