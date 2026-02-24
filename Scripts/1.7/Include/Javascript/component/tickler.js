var moy = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Poller(options) {
    var params = options.params || {};
    var requestType = options.requestType || 'GET';
    var pollingInterval = options.pollingInterval || 1000 * 60;
    var dueTime = options.dueTime || 1000 * 60;
    var intervalId;

    this.start = function() {
        setTimeout(function() {
            intervalId = setInterval(function() {
                $.ajax({
                    type: requestType,
                    data: params,
                    url: options.url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data) {
                        try {
                            // sometimes the services errors out. sql exception or something. the success callback
                            // of course shouldn't fire on 500 server error, but it does somehow. maybe if the user
                            // session times out and they try to make the request. not sure but it happens. data.d
                            // should always returns an empty array at least (assuming no errors occur).
                            $.publish(options.eventName, [data.d]);
                        } catch (e) {
                        }
                    }
                });
            },
                        pollingInterval
                    );
        },
                    dueTime
                );
    };

    this.stop = function() {
        clearInterval(intervalId);
    };

    return true;
}

function dataBind(items) {
    var ticklerContainter = allUIMenus.find('tickler-menu').container;
    var menu = ticklerContainter.children('.fg-menu');
    
    menu.children('li').remove();

    if (items == null || items.length == 0) {
        menu.append('<li><a class="ui-corner-all" href="#">No Upcoming Items</a></li>');
        return;
    }
    
    var showAfterRefresh = false;

    if (ticklerContainter.is(':visible')) {
        ticklerContainter.fadeOut('slow');
        showAfterRefresh = true;
    }

    $(items).each(function() {
        menu.append(
            $('<li />').append(
                $('<a class="ui-corner-all" />')
                    .attr('href', this.EventUrl)
                    .attr('title', itemDateToString(this.StartDate))
                    .text(this.Subject + ' - ' + this.DisplayDate)
            )
        );
    });
        
    if (showAfterRefresh)
        ticklerContainter.fadeIn('slow');
}

// use Nick's dateformat plugin for this
function itemDateToString(date) {
    var month = moy[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var suffix = hours > 12 ? 'PM' : 'AM';
    var offset = hours % 12;

    hours = offset % 12 == 0 ? 12 : offset;
    minutes = minutes > 9 ? minutes : '0' + minutes;
    
    return month + ' ' + day + ', ' + year + ' ' + hours + ':' + minutes + ' ' + suffix;
}

$(function() {
    if (typeof EventConfig == 'undefined')
        return;

    var eventName = 'NewItems';
    var ticklerPoller = new Poller({
        //params: { userId: EventConfig.UserId },
        params: JSON.stringify({ userId: EventConfig.UserId }),
        //url: REISys.Platform.WebRoot + 'Platform/WebServices/TicklerService.svc/GetSubscribedEvents',
        url: REISys.Platform.WebRoot + 'Platform/Interface/Tickler/TicklerService.aspx/GetSubscribedEvents',
        requestType: 'POST',
        eventName: eventName,
        pollingInterval: EventConfig.PollingInterval,
        dueTime: EventConfig.DueTime
    });

    $.subscribe(eventName, function(newItems) {
        $(newItems).each(function() {
            this.StartDate = new Date(parseInt(this.StartDate.substr(6)));
        });
            
        dataBind(newItems);
    });

    ticklerPoller.start();
});