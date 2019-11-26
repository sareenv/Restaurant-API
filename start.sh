set -e 
echo 'Starting all the microservices in background mode.'
echo 'The script will automate the process of running each microservice by running in background mode. The script needs to stop any service which is using these ports.'
sudo lsof -ti:9090 | xargs kill
sudo lsof -ti:8888 | xargs kill
sudo lsof -ti:8989 | xargs kill
echo 'Stopped services accessing the ports these microservice require'
sudo node service/admin.js &
sudo node service/authentication.js &
sudo node service/order.js &
echo '--------------------------------'
echo 'Microservices are running in background mode.'
read -p "Press enter to continue"
sudo lsof -ti:9090 | xargs kill
sudo lsof -ti:8888 | xargs kill
sudo lsof -ti:8989 | xargs kill
kill %1