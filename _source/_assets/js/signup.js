$(function () {

    var email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        is_processing = false,
        has_tried = false,
        form_valid = false,
        pass_blacklist = false,
        one_checked = false,
        signup_form = '#developer_signup',
        api_url = 'https://www.okta.com/developerapi';

    if ((localStorage.getItem('okta_dev_country') == null || localStorage.getItem('okta_dev_region') == null) && typeof geoip2 != 'undefined'){
        var geo_error = function(error) {
            return;
        };
        var geo_success = function(geoipResponse) {
            localStorage.setItem('okta_dev_country', geoipResponse.country.names.en);
            localStorage.setItem('okta_dev_region', geoipResponse.subdivisions[0].names.en);

            update_form_location();
        };
        geoip2.city(geo_success, geo_error);
    }
    else {
        update_form_location();
    }

    $(signup_form + ' .request_source').val(window.location.href);

    if (localStorage.getItem('okta_dev_ip') == null) {
        $.ajax({
            url: api_url + '/ip_address/',
            method: 'get'
        })
        .done(function(resp) {
            localStorage.setItem('okta_dev_ip', resp.ip_address.toString());

            update_form_ip();
        });
    }
    else {
        update_form_ip();
    }

    $(signup_form).submit(function(e){
        e.preventDefault;
        has_tried = true;

        if (! is_processing) {
            form_processing(true);

            form_valid = true;

            // validate form
            $(signup_form + ' .required').each(function(){
                validate_input($(this));
            });

            if (form_valid) {
                // update submission timestamp
                $(signup_form + ' #CASL_Time_Stamp__c').val(Date.now());

                // get email blacklist status
                $.ajax({
                    url: api_url + '/blacklist/',
                    cache: false,
                    method: 'get',
                    data: $(signup_form + ' #email').serializeArray()
                })
                .done(function(resp) {
                    pass_blacklist = resp.status;
                })
                .always(function(resp){
                    if (pass_blacklist) {
                        $.ajax({
                            url: api_url + '/create/',
                            cache: false,
                            method: 'get',
                            data: $(signup_form).serializeArray()
                        })
                        .done(function(resp) {
                            var url = window.location.toString(),
                                thank_you_url = resp.thankyou;

                            // preserve query string
                            if (url.indexOf('?') > 0) {
                                thank_you_url = thank_you_url.concat(url.substr(url.indexOf('?'), url.length));
                            }
                            // preserve hash
                            else if (window.location.hash != '') {
                                thank_you_url = thank_you_url.concat(window.location.hash.toString());
                            }

                            localStorage.setItem('okta_dev_domain',resp.org_domain);
                            window.location.href = thank_you_url;
                        })
                        .fail(function(resp) {
                            if ($.trim(resp.error_message)) {
                                $(signup_form + ' .global-error').html(resp.error_message.toString()).show();
                            }

                            if (count(resp.invalid_inputs) > 0) {
                                $(signup_form + ' :input').each(function(){
                                    if ($.inArray($(this).attr('name'), resp.invalid_inputs) >= 0) {
                                        $(this).parent('div').removeClass('is-valid')
                                        $(this).parent('div').addClass('is-invalid')
                                    }
                                });
                            }
                        })
                        .always(function(resp){
                            form_processing(false);
                        });
                    }
                    else {
                        $('#developer_signup').hide();
                        $('#developer_error').show();
                    }
                });
            }
            else {
                form_processing(false);
            }
        }

        return false;
    });

    // validate changes as they're made after a submission attempt
    $(signup_form + ' .required').keyup(function(){
        if (has_tried) {
            validate_input($(this));
        }
    });

    // update opt in based on selection
    $(signup_form + ' .casl_optin :input').on('click', function(){
        if ($(this).val() == 'yes') {
            $('#Communication_Opt_in__c').val('true');
            $('#Communication_Opt_out__c').val('false');
        }
        else {
            $('#Communication_Opt_in__c').val('false');
            $('#Communication_Opt_out__c').val('true');
        }
    });

    /**
     * Change form processing state, when processing submission requests not processed and
     * submit button text changes to spinner graphic
     *
     * @param status            boolean form processing status
     */
    function form_processing(status) {
        if (status) {
            is_processing = true;
            $('.OccForm-submit').addClass('is-processing');
        }
        else {
            is_processing = false;
            $('.OccForm-submit').removeClass('is-processing');
        }
    }

    /**
     * Validate provided input value, updates parent div styles based on value provided
     *
     * @param which             form input element
     */
    function validate_input(which) {
        which.closest('div').removeClass('is-valid');

        // field missing value
        if (which.val() == '') {
            form_valid = false;
            which.closest('div').addClass('is-invalid');
        }
        // email field has invalid address format
        else if (which.hasClass('valid-email') && ! email_regex.test(which.val())) {
            form_valid = false;
            which.closest('div').addClass('is-invalid');
        }
        // if visible make sure one communication preference is selected
        else if (which.hasClass('valid-radio')){
            if (which.is(':checked') || !which.is(':visible')) {
                one_checked = true;
            }
            // apply results to both options
            if (!one_checked) {
                form_valid = false;
                which.closest('div').addClass('is-invalid');
            }
            else {
                which.closest('div').removeClass('is-invalid');
                which.closest('div').addClass('is-valid');
            }
        }
        // input appears valid
        else {
            which.closest('div').removeClass('is-invalid');
            which.closest('div').addClass('is-valid');
        }
    }

    /**
     * Update form values with saved location data
     */
    function update_form_location() {
        if (localStorage.getItem('okta_dev_country') != null) {
            $(signup_form + ' #Country').val(localStorage.getItem('okta_dev_country'));
        }

        if (localStorage.getItem('okta_dev_region') != null) {
            $(signup_form + ' #State').val(localStorage.getItem('okta_dev_region'));
            $(signup_form + ' #Province').val(localStorage.getItem('okta_dev_region'));
        }

        if (localStorage.getItem('okta_dev_country') == 'Canada') {
            $(signup_form + ' .casl-inputs').show();
        }
    }

    /**
     * Update form value with saved ip data
     */
    function update_form_ip() {
        if (localStorage.getItem('okta_dev_ip') != null) {
            $(signup_form + ' .request_ip').val(localStorage.getItem('okta_dev_ip'));
        }
    }

    /**
     * Thank you page url output
     */
    var generated_domain = localStorage.getItem('okta_dev_domain');
    if (generated_domain != null) {
        $('#domain_link').html('<p>Access your new developer account now by visiting <a href="https://' + generated_domain + '.oktapreview.com">' + generated_domain + '.oktapreview.com</a></p>');
    }
});
