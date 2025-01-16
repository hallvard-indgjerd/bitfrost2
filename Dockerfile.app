###############################################################################
# Step 1 : Composer Install
#
FROM composer:latest AS composer

WORKDIR /app
# Install deps for production only
COPY ./api/composer.lock ./api/composer.json ./
#RUN composer install --no-ansi --no-dev --no-interaction --no-progress --no-scripts --optimize-autoloader #Without development tools

RUN composer install --no-ansi --no-interaction --no-progress --no-scripts --optimize-autoloader

###############################################################################
# Step 2 : Final
#
FROM php:8-apache
RUN apt-get update
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN install-php-extensions pdo_mysql pdo_pgsql \
	&& apt-get purge \
	&& rm -rf /tmp/* /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY . .
COPY --from=composer /app/vendor ./api/vendor

COPY ./config/server.crt /etc/apache2/ssl/server.crt
COPY ./config/server.key /etc/apache2/ssl/server.key
COPY ./config/dev.conf /etc/apache2/sites-enabled/dev.conf
#RUN docker-php-ext-install mysqli pdo pdo_mysql zip mbstring
RUN a2enmod rewrite
RUN a2enmod ssl
RUN service apache2 restart
