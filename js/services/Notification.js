angular
.module('stack.service')
.factory('notificationService', ['$q', 'userService', '$http',  function ($q, userService, $http) {
	return {
		notify: function(to, subject){
	        var questionLink  = location.href;
			var text = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
				'<html xmlns="http://www.w3.org/1999/xhtml" style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">\n' +
				'<head>\n' +
				'<meta name="viewport" content="width=device-width" />\n' +
				'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n' +
				'<title>Actionable emails e.g. reset password</title>\n' +
				'\n' +
				'\n' +
				'<style type="text/css">\n' +
				'img {\n' +
				'max-width: 100%;\n' +
				'}\n' +
				'body {\n' +
				'-webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;\n' +
				'}\n' +
				'body {\n' +
				'background-color: #f6f6f6;\n' +
				'}\n' +
				'@media only screen and (max-width: 640px) {\n' +
				'\tbody {\n' +
				'\t\tpadding: 0 !important;\n' +
				'\t}\n' +
				'\th1 {\n' +
				'\t\tfont-weight: 800 !important; margin: 20px 0 5px !important;\n' +
				'\t}\n' +
				'\th2 {\n' +
				'\t\tfont-weight: 800 !important; margin: 20px 0 5px !important;\n' +
				'\t}\n' +
				'\th3 {\n' +
				'\t\tfont-weight: 800 !important; margin: 20px 0 5px !important;\n' +
				'\t}\n' +
				'\th4 {\n' +
				'\t\tfont-weight: 800 !important; margin: 20px 0 5px !important;\n' +
				'\t}\n' +
				'\th1 {\n' +
				'\t\tfont-size: 22px !important;\n' +
				'\t}\n' +
				'\th2 {\n' +
				'\t\tfont-size: 18px !important;\n' +
				'\t}\n' +
				'\th3 {\n' +
				'\t\tfont-size: 16px !important;\n' +
				'\t}\n' +
				'\t.container {\n' +
				'\t\tpadding: 0 !important; width: 100% !important;\n' +
				'\t}\n' +
				'\t.content {\n' +
				'\t\tpadding: 0 !important;\n' +
				'\t}\n' +
				'\t.content-wrap {\n' +
				'\t\tpadding: 10px !important;\n' +
				'\t}\n' +
				'\t.invoice {\n' +
				'\t\twidth: 100% !important;\n' +
				'\t}\n' +
				'}\n' +
				'</style>\n' +
				'</head>\n' +
				'\n' +
				'<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">\n' +
				'\n' +
				'<table class="body-wrap" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">\n' +
				'\t<tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">\n' +
				'\t\t<td style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>\n' +
				'\t\t\t\t<td class="container" width="600" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">\n' +
				'\t\t\t\t\t\t<div class="content" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">\n' +
				'\t\t\t\t\t\t\t\t<table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff">\n' +
				'\t\t\t\t\t\t\t\t\t<tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">\n' +
				'\t\t\t\t\t\t\t\t\t<td class="content-wrap" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n' +
				'\t\t\t\t\t\t\t\t\t\t\t<meta itemprop="name" content="See Question" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t<table width="100%" cellpadding="0" cellspacing="0" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="content-block" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Please see your question by clicking the link below.\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="content-block" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tYou will get notification when some activity happens on your question\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href="' + questionLink +
				'" class="btn-primary" itemprop="url" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Open Question</a>\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t&mdash; Integrated Learning Center\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr></table></td>\n' +
				'\t\t\t\t\t\t\t\t\t\t</tr></table><div class="footer" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">\n' +
				'\t\t\t\t\t\t\t\t\t\t<table width="100%" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="aligncenter content-block" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">Follow <a href="http://twitter.com/askilc_center" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@askilc_center</a> on Twitter.</td>\n' +
				'\t\t\t\t\t\t\t\t\t\t\t\t</tr></table></div></div>\n' +
				'\t\t\t\t</td>\n' +
				'\t\t\t\t<td style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>\n' +
				'\t\t</tr></table></body>\n' +
				'</html>';

			var data = {
				text: text,
				html:true,
				to:to,
				subject: subject
			}

			return $http({
				method: 'POST',
				url: '/api/sendEmail',
				data: data,
			})
		}
	}
}]);