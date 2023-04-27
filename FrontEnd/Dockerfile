# Use an official Ubuntu runtime as a parent image
FROM ubuntu:latest

# Update the apt package index and install required packages
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-dev build-essential curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g typescript


# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install Python packages
RUN python3 -m pip install -r requirements.txt

# Install npm packages
RUN npm install

# Copy the start script to the container
COPY ./docker.sh .
# COPY ./run.sh .

# EXPOSE 5000

# Change permissions to allow execution of the start script
RUN chmod +x ./docker.sh
# RUN chmod +x ./run.sh

# Set the command to run the start script
CMD ["./docker.sh"]
# CMD ["./run.sh"]