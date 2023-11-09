FROM jetbrains/teamcity-agent:2023.05.4-linux-sudo

USER root

RUN ["/bin/bash", "-c", "apt-get update \
    && apt-get install -y wget \
    && wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y apt-transport-https \
    && apt-get update \
    && apt-get install -y dotnet-sdk-7.0 \
    && dotnet tool install GitVersion.Tool --version 5.* --tool-path /bin"]

USER buildagent
