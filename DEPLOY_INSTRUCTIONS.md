# Deployment Guide for Lucky Lubricant Rewards

This guide will help you deploy the "Lucky Lubricant Rewards" frontend to `reward.luckylunricants.in` using PM2 and Nginx.

## Prerequisites
- Node.js installed on your server.
- PM2 installed globally (`npm install -g pm2`).
- Nginx installed and running.

## Step 1: Build the Project
Run the following commands in the project directory to install dependencies and build the optimized production files.

```bash
npm install
npm run build
```

This will create a `dist` folder containing your website.

## Step 2: Start with PM2
We have created a `ecosystem.config.cjs` file for you. This configuration uses `npx serve` to serve your `dist` folder on port **3000**.

Start the application:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Check if it's running:
```bash
pm2 status
```
You should see `lucky-rewards-frontend` online.

## Step 3: Configure Nginx
We have created a `nginx_reward.conf` file.

1.  Copy the content of `nginx_reward.conf` to your Nginx sites-available folder (usually `/etc/nginx/sites-available/reward.luckylunricants.in`).
2.  Link it to sites-enabled:
    ```bash
    sudo ln -s /etc/nginx/sites-available/reward.luckylunricants.in /etc/nginx/sites-enabled/
    ```
3.  Test configuration:
    ```bash
    sudo nginx -t
    ```
4.  Restart Nginx:
    ```bash
    sudo systemctl restart nginx
    ```

## Step 4: SSL Certificate (Certbot)
To verify your SSL (HTTPS) as you mentioned clearly (`ssl lagaoga`), run:

```bash
sudo certbot --nginx -d reward.luckylunricants.in
```

Follow the prompts to enable redirect to HTTPS.

## Summary
- **Domain**: `reward.luckylunricants.in` -> Points to Server IP.
- **Nginx**: Listens on Domain -> Proxies to Port 3000.
- **PM2**: Runs `serve` on Port 3000 -> Serves `dist` folder.
