<script>
// This code copied more-or-less verbatim from
// https://support.appsflyer.com/hc/en-us/articles/360000677217#the-script
// It modifies the code under our app store buttons to map through onelink including
// the URL params that lead the user to this landing page.

// Returns the value of a parameter existing in the page's URL or ' ' if not exists.
function getParameterFromURL(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (userAgent) {
    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }
  }
  return "unknown";
}

function isAFLink() {
  return getParameterFromURL('af_redirect');
}

function isFacebook() {
  if (document.referrer && document.referrer != "") {
    return document.referrer.toLowerCase().includes('facebook');
  } else {
    return false;
  }
}

// generateUrl returns the URL to use behind the iOS and Android "Download" buttons on a landing
// page, based on the source of the page visitor.
// By default these buttons should direct to the apps' pages on iTunes and Google Play.
// If these links should be kept with no change, generateUrl returns ''.
// Otherwise, generateUrl returns the URL to be used under BOTH buttons (a single app download
// button could also be used in this case).
// Parameters: isDebug - if true, alerts are issued for each of the cases, otherwise not.
function generateUrl(isDebug) {
  var oneLinkURL = 'https://try.sendwave.com/kjap/seo';   // **** Replace with your own basic OneLink URL ****
  var webFormURL = 'https://wave.com'; // **** Replace with your own web form URL for getting the user's email or SMS ****
  var finalURL = "";
  var partnerIDParam = '?pid=';

  var campaignValue;
  if (getParameterFromURL('af_c')) {
    campaignValue = getParameterFromURL('af_c');
  } else if (getParameterFromURL('utm_campaign')) {
    campaignValue = getParameterFromURL('utm_campaign');
  } else if (document.getElementsByTagName('title')[0]) {
    campaignValue = document.getElementsByTagName('title')[0].innerText;
  } else {
    campaignValue = 'unknown';
  }
  var campaignParam = '&c=';
  var gclidParam = '&af_sub1=';
  var gclidValue = getParameterFromURL('gclid');
  var kwParam = '&af_keywords=';
  var pidValue;
  var kwValue = getParameterFromURL('keyword');

  if (getParameterFromURL('af_pid')) {
    pidValue = getParameterFromURL('af_pid');
  } else if (getParameterFromURL('utm_source')) {
    pidValue = getParameterFromURL('utm_source');
  }

  // Desktop user
  if (!isMobileDevice()) {
    // Appsflyer assumes that you're clever and using a service that texts or emails a link
    // to the appstore, and the webFormURL above is the URL for that. We don't do that (yet)
    // at Wave, so the line below from their provided script doesn't make sense:
    // return webFormURL;
    // instead we'll do our own thing and return an empty string. The code invoking this will do
    // nothing if an empty string is returned.
    return '';
  }

  // User was redirected using af_r parameter on an AppsFlyer attribution link
  if (isAFLink()) {
    if (isDebug) {
      alert("This user comes from AppsFlyer by redirection and is ready to be attributed. \nKeep direct app store links.");
    }
    return; // in this case, the original store links in the install buttons stay the same

    /*
    If you want one install button in the landing page that serves both iOS and Android, uncomment
    the code below. The code identifies the operating system and returns the relevant direct link to
    Google Play or iTunes

    if (getMobileOperatingSystem() === 'Android') {
      return 'direct link to Google Play';
    }

    if (getMobileOperatingSystem() === 'iOS') {
      return 'direct link to iTunes';
    }
    */
  }

  // Google Ads
  if (gclidValue) {
    partnerIDParam += 'google_lp';
    campaignParam += campaignValue;
    gclidParam += gclidValue
    if (!kwValue) {
      finalURL = oneLinkURL + partnerIDParam + campaignParam + gclidParam;
      if (isDebug) {
        alert("This user comes from Google AdWords\n " + finalURL);
      }
      return finalURL;

    } else { // Google Ads with KW
      kwParam += kwValue;
      finalURL = oneLinkURL + partnerIDParam + campaignParam + gclidParam + kwParam;
      if (isDebug) {
        alert("This user comes from Google AdWords - there is a keyword associated with the ad\n " + finalURL);
      }
      return finalURL;
    }

  } else if (isFacebook()) {
    if (isDebug) {
      alert("This user comes from a paid Facebook ad - don't do anything. \nKeep direct app store links.");
    }
    return '';
  // Other SRNs and custom networks
  } else if (pidValue) {
      campaignParam += campaignValue;
      partnerIDParam += pidValue;
      finalURL = oneLinkURL + partnerIDParam + campaignParam;
      if (isDebug) {
        alert("This user comes the SRN or custom network " + pidValue + "\n" + finalURL);
      }
      return finalURL;
  } else { // organic mobile user
    campaignParam += campaignValue;
    partnerIDParam += 'website'; //**** Replace value if you wish organic users to be attributed to another media source than 'website' ****
    finalURL = oneLinkURL + partnerIDParam + campaignParam;
    if (isDebug) {
      alert("This user comes from an unknown mobile source.\n The user would be attributed to media source 'website' and to the campaign " + campaignParam + "\n" + finalURL);
    }
    return finalURL;
  }
}

 
// AppsFlyer Onelink
window.onload = function () {
    var newUrl = generateUrl(false);
    if (newUrl && newUrl !== null && newUrl !== '') {
        var buttons = document.getElementsByClassName('store-button');
        for (i = 0, len = buttons.length; i < len; i++) {
            buttons[i].setAttribute('href', newUrl);
        }
    }
};
  
  
</script>