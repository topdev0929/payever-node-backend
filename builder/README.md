# builder-application

jiraKey: BMq


# Builder currently support dynamic injection of Ingresses when a new business is created.

A new feature has been added to ingress is related to geoIp capabilities in order to filter or redirect based on requested IP geo location.
Below is a guideline on how to make use of it:

*The following tag should be used to be replaced in order to inject the geoIp rules: {{geopip_rules}}*

## The following variables are available to be used to filter based on the request geoIp:

- geoip2_country_code => DE,FR,NL,DK...
- geoip2_country_name => Germany, France, Netherlands, Denmark...
- geoip2_continent_code => EU, NA, AS, AF...
- geoip2_continent_name => Europe, North America, Asia, Africa...
- meta_region => North America, Western Europe, Eastern Europe, South East Asia, Latin America, Middle East

*refer to https://gitlab.devpayever.com/infra/provision/-/blob/master/ingress-nginx/static/nginx.tmpl#L368*

## The following custom function can be used to lowercase strings

set_by_lua_block $lowercase_country_code { return to_lowercase(ngx.var.geoip2_country_code) }

## Important information:
  At configuration-snippet the following is not supported:
  - Nested if statements
  - And/Or conditions into if statements

### Below its a sample of how to use the geoIp variables to be replaced by geopip_rules tag:

>>>
    ### Custom Functions to lowercase strings
    set_by_lua_block $lowercase_country_code { return
    to_lowercase(ngx.var.geoip2_country_code) }

    set_by_lua_block $lowercase_meta_region { return
    to_lowercase(ngx.var.meta_region) }

    *This case, if the country code is 'de' then we force to skip the next rules*
    if ($lowercase_country_code = 'de') { set $lowercase_meta_region 'no-enter'; }

    if ($lowercase_meta_region = 'western europe')  { rewrite ^/$ https://payever.careers/uk break; }
    if ($lowercase_meta_region = 'eastern europe')  { rewrite ^/$ https://payever.careers/ee break; }
    if ($lowercase_meta_region = 'latin america')   { rewrite ^/$ https://payever.careers/la break; }
    if ($lowercase_meta_region = 'south east asia') { rewrite ^/$ https://payever.careers/sea break; }
>>>