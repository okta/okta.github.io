#! /bin/bash

# Google Chrome Installer/Uninstaller for 64-bit RHEL/CentOS 6 or 7
# (C) Richard K. Lloyd 2017 <rklloyd@gmail.com>
# See https://chrome.richardlloyd.org.uk/ for further details.

# Barring bug fixes, this is the final version of the script!
# Google Chrome 59+ will *not* work on RHEL/CentOS 6, so users
# on that platform should not upgrade beyond version 58.

# This script is in the public domain and has no warranty.
# It needs to be run as root because it installs/uninstalls RPMs.

# Minimum system requirements:
# - 64-bit RHEL/CentOS 6.6 or later (32-bit is no longer supported)
#   (any 64-bit RHEL/CentOS 7 version is supported)
# - Minimum RHEL/CentOS 6 kernel version supported is 2.6.32-431.el6
#   (any RHEL/CentOS 7 kernel version is supported)
# - At least 250MB free in each of the temporary directory, /opt and /root
# - A working yum system (including http proxy configured if needed)
# - http_proxy and https_proxy env vars set if you are using an http proxy
# - Google Chrome should not be running at the same time as this script

show_syntax()
# Show syntax of script
{
   cat <<@EOF
Syntax: ./install_chrome.sh [-b] [-d] [-f [-f [-f]]] [-h] [-n] [-q] [-r] [-s]
        [-t tmpdir] [-u] [-U]

-b (or --beta) will switch to beta versions (google-chrome-beta).
-d (or --delete) will delete the temporary directory used for downloads
   if an installation was successful.
-f (or --force) forces an automatic "y" for any interactive prompting
   except for OS mismatch/OS upgrade/reboot prompts. Specify -f twice to force
   it for OS mismatches or OS upgrades as well and three times for reboots
   on top of that.
-h (or -? or --help) will display this syntax message.
-n (or --dryrun) will show what actions the script will take,
   but it won't actually perform those actions.
-q (or --quiet) will switch to "quiet mode" where minimal info is displayed.
   Specify -q twice to go completely silent except for errors.
-r (or --re-run) indicates the script is being re-run after an upgrade
   (internal use only - do not use -r during an initial run of the script).
-s (or --stable) will switch to stable versions (google-chrome-stable),
   which is the default if -b or -U haven't previously been specified.
-t tmpdir (or --tmpdir tmpdir) will use tmpdir as the temporary directory
   parent tree rather than \$TMPDIR (if set) or /tmp.
-u performs an uninstallation of Google Chrome and chrome-deps-* rather the
   default action of an installation.
-U (or --unstable) will switch to unstable versions (google-chrome-unstable).
@EOF
}

# Current version of this script
version="8.00"

# This script will download/install the following for an installation:

# These RHEL/CentOS 6 RPMs and their (many!) deps that aren't already installed
# or are out-of-date:
# redhat-lsb, wget, xdg-utils, GConf2, libXScrnSaver, libX11, gnome-keyring,
# gcc, glibc-devel, nss, rpm-build, libexif, dbus, selinux-policy, xz
# and rpmdevtools.
# These RHEL/CentOS 7 RPMs and their (many!) deps that aren't already installed
# or are out-of-date:
# redhat-lsb, wget, xdg-utils, GConf2, libXscrnSaver. libX11, gnome-keyring,
# libexif, dbus, nss, selinux-policy and xz.
# The latest Google Chrome RPM if not already downloaded (or out-of-date).
# RHEL/CentOS 6 only: libstdc++ library from a gcc 6.2.0 source build.

# For RHEL/CentOS 6 only:
# It then copies the downloaded libstdc++ library into /opt/google/chrome*/lib.

# Next, it C-compiles a shared library that provides the "missing"
# gnome_keyring_attribute_list_new function that's installed as
# /opt/google/chrome*/lib/libgnome-keyring.so.0 and linked against a
# newly installed soft-link called
# /opt/google/chrome*/lib/link-to-libgmome-keyring.so.0 which in turn points
# to the system copy of libgmome-keyring.so.0.

# Finally, it creates and installs a chrome-deps-* RPM which includes the
# downloaded libstdc++ library, libgnome-keyring.so.0, the soft-link
# link-to-libgmome-keyring.so.0 and code to modify the
# google-chrome wrapper. (End of RHEL/CentOS 6 only actions)

# Note that you can't run Google Chrome as root - it stops you from doing so.

# Revision history:

# 8.00 - 4th May 2017
# - Barring bug fixes, this is the final release of the script because
#   Google Chrome 59+ will no longer work on RHEL/CentOS 6.
# - Changed all 2016 references to 2017.
# - Moved to gcc 7.1.0 for libstdc++ and bumped chrome-deps version
#   to 4.00 because of that.
# - If Google Chrome 58 is installed on RHEL/CentOS 6, warn that it's the
#   last major release that works on RHEL/CentOS 6 and that it will be an
#   increasing security risk to run it in the long term.
# - If version 59+ of Google Chrome is downloadable/installable on RHEL/CentOS 6,
#   refuse to download/install it and delete the Chrome repo file to
#   prevent "yum update" downloading it.

# 7.51 - 22nd December 2016
# - Superuser now required to run cleanup code in error() function.
# - A checksum and size has been added to version.dat and this is checked
#   (against the uncompressed version) when an upgraded script is downloaded.
# - A new gcc 6.3.0 release meant a fresh build of the libstdc++ library
#   and a version bump of the chrome-deps RPM.

# 7.50 - 26th August 2016
# - If the script is upgraded and re-run, pass a new -r option to avoid a
#   second upgrade, which might have otherwise happened (yes, in a
#   never-ending loop) if the downloaded version.dat file was a cached copy.
# - xz is now installed/updated early on (prior to any wget-based downloads).
# - Upgrades now download/decompress install_chrome.sh.xz, only falling
#   back to the uncompressed download if that fails.
# - Use gcc 6.2.0 as the basis for libstdc++.so.
# - Web site is now 100% SSL (http requests redirect to the equivalent https),
#   thanks to a new auto-renewing Let's Encrypt secure cert.

# 7.40 - 15th May 2016
# - If wget isn't installed (e.g. it's a minimal CentOS 6 install) or it's
#   out-of-date, download and install it.
# - dbus and selinux-policy (if SELinux is enabled) dependencies have been
#   added, which may help minimal installs.
# - If dbus isn't running on CentOS 6, it's now started and also enabled via
#   chkconfig for future reboots.
# - If any of the main dependencies are out-of-date, they will now be updated
#   (this is particularly critical for nss and selinux-policy, which won't work
#   on an unpatched 6.7 install).

# 7.31 - 29th April 2016
# - The Google Chrome binary seems to dynamically load libexif.so.12 at
#   runtime which caused me to miss libexif off the dependencies list, so
#   it's finally been added in.
# - gcc 6.1.0 is now used as the basis for the libstdc++ download, so that
#   meant a new size and checksum as usual.

# 7.30 - 5th March 2016
# - Google have completely pulled the 32-bit Linux Google Chrome repository,
#   so I've matched this by dropping 32-bit support (I don't understand
#   why anyone would ever install 32-bit RHEL/CentOS, but that's just me :-) ).
# - An out-of-date kernel is always an error now rather than a warning.

# 7.24 - 13th February 2016
# - Adjusted year references to be 2016.
# - Finally removed all references to LD_PRELOAD.
# - Warn that this script's 32-bit support is deprecated and will be
#   removed in a future release (shortly after Google Chrome drops 32-bit).
# - CentoS 7.2.1511 is on the mirrors, so grab 32-bit libstdc++ from that
#   and switch the fallback to the 7.1.1503 version.

# 7.23 - 15th December 2015
# - Increased version of chrome-deps package to 3.12 because of the newer
#   libstdc++ in the previous release (yes, I should have done that with 7.22).
# - wget now ignores cached files (e.g. from proxies) when downloading.
# - If your running kernel is older than 2.6.32-431.el6 and you either refuse
#   (or fail) to update it when prompted or refuse to reboot after the latest
#   kernel update, then this is now a fatal error rather than a warning.
# - On an unrelated note (the company I work for hosts the official site),
#   good luck to Tim Peake/Principia today - see https://principia.org.uk/

# 7.22 - 12th December 2015
# - The gcc 5.3.0-built version of 64-bit libstdc++.so.6 is now downloaded,
#   triggering a new script release.
# - RHEL/CentOS 6.6 is now the mandatory minimum 6.X release this script will
#   run on. If you don't upgrade to at least 6.6 when prompted, the script
#   will abort (previous releases let you continue with a warning).
#   
# 7.21 - 23rd July 2015
# - gcc 5.2.0 was recently released, so the downloadable 64-bit libstdc++.so.6
#   was rebuilt using it. A new checksum/size for the library meant a new
#   script release.

# 7.20 - 7th June 2015
# - Warn about out-of-date kernels that will cause Google Chrome to crash
#   and offer to update the kernel (and preferably reboot).
# - Fixed a yum repo path typo shown during a dry run (-n) (reported by John
#    Stembridge).
# - Don't try to create a spec file if the dry run option -n is specified
#   (also reported by John Stembridge).
# - Removed remove_redundant_libs() function - ironically, it's now redundant.

# 7.13 - 24th April 2015
# - Updated the downloadable 64-bit libstdc++.so.6 to one built from gcc 5.1.0.
#   Sadly, the uncompressed library has bloated to being 60% bigger than the
#   one created from gcc 4.9.2 :-(

# 7.12 - 10th April 2015
# - CentOS 7.0.1406 got abruptly shunted off to vault.centos.org this week,
#   promptly completely breaking the 32-bit libstdc++ RPM download. Now the
#   download looks at latest 7.1.1503 RPM on mirror.centos.org first and if
#   that gets moved (which it eventually will be when 7.2 comes out), it looks
#   at the latest 7.0.1406 update on vault.centos.org as a fallback.

# 7.11 - 23rd February 2015
# - Added a Provides: link to the spec file to avoid RPM dependency issues
#   with the soft-link (thanks to Raymond Page for spotting the issue) and
#   bumped chrome-deps-* RPM version to 3.11.

# 7.10 - 6th February 2015
# - The later libstdc++ works fine with LD_LIBRARY_PATH pointing to it when
#   sub-processes are run, so we can finally stop using LD_PRELOAD and the
#   unset_var.so shared library.
# - We still need the "missing" gnome_keyring_attribute_list_new function
#   that's in later releases of libgnome-keyring.so.0, so build a library
#   using that name with the function in it, but link it against a soft-link
#   (link-to-libgnome-keyring.so.0 which soft-links to the system-installed
#   copy of libgnome-keyring.so.0). Convoluted, but allows us to bring in
#   both gnome_keyring_attribute_list_new and all the other library functions/
#   symbols in at start-up.
# - Added gnome-keyring as a dependency just to make sure it's there before
#   we go ahead with the machinations above.
# - 50% reduction in orphaned kitten-killing tendencies.

# 7.00 - 2nd February 2015
# - Raise minimum RHEL/CentOS 6 version required from 6.5 to 6.6. This is
#   because 6.6 now has library updates that negate the need to install patched
#   versions from Fedora 15 or 17.
# - The only external library that has to remain is libstdc++, which provides
#   the appropriate runtime symbols to satisfy the Google Chrome binary. The
#   good news is that it no longer needs to be patched. For 64-bit systems,
#   the libstdc++ is lifted by me from a gcc 4.9.2 source build I did.
#   For 32-bit systems, libstdc++ is extracted from the CentOS 7 libstdc++ RPM.
# - If the updated CentOS 7 libstdc++ 32-bit RPM goes "missing" (e.g. it is
#   removed because of an even newer update), fall back to the
#   original 32-bit libstdc++ RPM that shipped with the initial CentOS 7 release.
#   I will release a new script version if a libstdc++ (or gcc source) update
#   happens of course.
# - Remove any unneeded /opt/google/chrome*/lib libraries that are probably
#   hanging around from earlier script releases. For the avoidance of
#   doubt, this includes removing the F15 libc library, thus removing the
#   GHOST vulnerability that previous script releases may have had.
# - Use %_topdir for RPM build dir location (thanks to Bob Hepple for this)
# - Changed year to 2015 in a few places.
# - Now kills less orphaned kittens than ever!

# 6.10 - 29th August 2014
# - Don't permanently run 2 copies of cat from the google-chrome script
#   (this is a horrible kludge intro'ed by Google Chrome 37). They both
#   crashed with the previous (6.00) install_chrome.sh, so now just redirect
#   stdout and stderr to /dev/null instead (OK, it'll hide console messages/
#   errors, but that's better than 2 core dumps or, indeed, running 2 cats).
# - Added "Obsoletes: chrome-deps" to the RPM spec file (suggested by a
#   couple of users).
# - Bumped both wrapper_mod_version and the chrome-deps RPM to version 2.10.

# 6.00 - 27th July 2014
# - Google Chrome 36 onwards now has separate install trees for each
#   RPM type (stable, beta, unstable), but bizarrely all 3 RPMs include an
#   /usr/bin/google-chrome soft-link, preventing simultaneous installation.
#   Code was duly added to deal with this significant change.
# - Added PackageKit as a dependency (some live CentOS DVDs don't install it).
# - Removed the last remnants of the custom CentOS 7 repo code.
# - Used a soft-link to fix a failed grep of google-chrome.desktop during the
#   installation of the beta or unstable RPM (this is a Google bug, not mine).
# - wrapper_mod_version changed to 2.00 and code added to scan for
#   all 3 RPM types since the defaults for all 3 of them are dubiously
#   stuck in a single /etc/default/google-chrome file.
# - Bumped chrome-deps-* version to 2.00 because check for google-chrome*
#   binary path was widened and the RPM name has changed to include
#   stable, beta or unstable as appropriate.
# - If an old "chrome-deps" RPM is present during (un)installation, remove it.

# 5.02 - 10th July 2014
# - Now CentOS 7 final is out, remove the pre-release repo code and
#   delete the .repo file if it was created. Refusing to upgrade the OS to
#   6.5 or later will now terminate the script rather than continue with a
#   warning. Changed all equivalent RHEL and CentOS references to be
#   RHEL/CentOS instead.

# 5.01 - 26th June 2014
# - Fix for latest CentOS 7 pre-release repo detection, because the latest
#   pre-release bizarrely includes placeholder .repo files that don't do
#   anything.

# 5.00 - 21st June 2014
# - Added support for pre-release CentOS 7, which mainly means no RPM building
#   and also the installation of missing dependencies. If no CentOS 7 repos are
#   detected - which is the current case with pre-release CentOS 7 versions -
#   in /etc/yum.repos.d, a "chrome-deps-updates" repo will be created (this
#   will be removed on later runs if any other .repo files are created, on the
#   assumption that the user has added their own repos for installing/updating
#   RPMs instead or the final CentOS 7 repos are already present).
# - Minimum RHEL/CentOS 6 release supported is now 6.5, which has been out for
#   over 6 months at the time of writing. This means libX11 and nss should be
#   up-to-date versions, avoiding run-time problems with older versions of
#   those packages.
# - Tidied up final messages e.g. it now says the latest version was already
#   installed if that was the case.
#   
# 4.70 - 17th May 2014
# - Added -f option to auto-force a "y" answer to any interactive prompt
#   without bothering to actually prompt you (thanks to Steve Cleveland for the
#   idea). The only exceptions to this are the prompts for an OS mismatch, OS
#   upgrade or reboot, but even those can be forced by specifying -f twice (or
#   three times for reboots).
# - Fixed the 2-hourly bash segfault recorded in syslog. It was caused by the
#   chrome binary self-calling the google-chrome bash script to get its version,
#   which is bizarre since surely it could just call one of its own functions
#   to get that? By unsetting LD_LIBRARY_PATH on the self-call, the segfault
#   was avoided. Bumped chrome-deps to version 1.21 because of this.

# 4.60 - 12th April 2014
# - The latest Google Chrome releases kept prompting me for a keyring
#   password when starting up. It turns out they were using the
#   gnome_keyring_attribute_list_new function, which didn't exist until Fedora
#   17's libgnome-keyring.so.0 library! Luckily, the F17 library works in
#   RHEL/CentOS 6, so that's been added and the chrome-deps RPM has been
#   bumped to version 1.20.
# - Added nss to the list of possible RHEL/CentOS 6 RPMs that are installed
#   (thanks to Ravi Saive at tecmint.com for this, though no-one told me
#   directly...).
# - Check the size and cksum of downloaded RPMs and delete them (and quit) if
#   they are bad.

# 4.50 - 11th December 2013
# - A user reported that file-roller wouldn't work when opening downloaded
#   .tar.gz files inside Google Chrome. It turns out LD_PRELOAD was still set
#   when file-roller tried to exec() sub-processes like gzip, so I now unset
#   LD_PRELOAD (as well as LD_LIBRARY_PATH) when exec'ing from within Google
#   Chrome, which fixes the issue. chrome-deps version was bumped to 1.10
#   because of this change. Another user suggested checking previously
#   downloaded F15 RPMs have the right checksum/size (and a fresh download is
#   forced if they don't), which has been implemented.

# 4.41 - 9th December 2013
# - Added glibc-devel to the list of dependencies because a user reported
#   that it wasn't dragged in by gcc. With the imminent release of Fedora 20,
#   Fedora 15 has been archived and the code has been changed to reflect that.
#   Removed SELinux warning at end of install - the last few releases of
#   Google Chrome don't seem to have a problem with enforcing mode w.r.t.
#   nacl_helper. Future releases of this script may remove all SELinux-related
#   code if enforcing mode remains OK. Google Chrome 31 is displaying a
#   manifestTypes error to the console in some setups, but this doesn't seem
#   to affect the running of Google Chrome.

# 4.40 - 5th October 2013
# - A similar issue to the 4.30 release cropped up again (reported by
#   the same user!) that I still can't reproduce. This time it was a missing
#   gdk_pixbuf_format_get_type symbol in F15's libgtk-x11-2.0. This was fixed
#   by additionally downloading F15's gdk-pixbuf2 RPM and extracting
#   libgdk_pixbuf-2.0 from it. This prompted a bump of the chrome-deps RPM to
#   version 1.03.

# 4.30 - 4th October 2013
# - The g_desktop_app_info_get_filename symbol in the F15 libgdk-x11-2.0
#   library is present in the F15 libgio-2.0 library (but not in RHEL/CentOS's).
#   The script used the former library, but not the latter and a user reported
#   a missing symbol crash due to this, despite my testing not showing the
#   issue. This release is therefore purely to add libgio-2.0 and its
#   libgobject-2.0 dependency to the set of extracted F15 libraries and has
#   also been tested against Google Chrome 30 and Google Talk Plugin 4.7.0.0.
#   The chrome-deps RPM is now at version 1.02 because of the two extra
#   libraries.

# 4.20 - 22nd August 2013
# - If the Google Chrome repo is enabled and a Google Chrome RPM is already
#   installed, use "yum check-update google-chrome-stable" to determine if
#   there is a newer version available and then fallback to using the
#   OmahaProxy site if there isn't.
# - Any newer version than what's been previously downloaded or installed
#   can now be downloaded/installed, rather than being exactly the version
#   displayed on the OmahaProxy site (which was out of date for a full day when
#   Chrome 29 was released, stopping this script from updating to version 29).
# - Removed terminal messages warning because this is fixed with Google Chrome
#   29.
# - Used extra parameters in the OmahaProxy request to narrow the data down to
#   the exact channel and platform (linux).

# 4.10 - 8th August 2013
# - Fixed Google Talk (Hangouts) plugin crash - it was because, unlike Google
#   Chrome itself, the plugin hasn't been built with later libraries, so it
#   needs LD_LIBRARY_PATH to be unset. There still appears to be other
#   library issues with the Hangouts plugin, mainly because the older libraries
#   don't implement certain calls it uses. Google need to update the plugin!
#   Bumped chrome-deps version to 1.01 because of the unset_var.c change.
# - Catered for non-standard i686 RPM build trees on 32-bit systems. I couldn't
#   reproduce this myself (it uses i386 for me all the time in RHEL/CentOS and
#   Scientific Linux 32-bit VMs) but the code is in place anyway for the users
#   that reported the issue.
# - modify_wrapper (now bumped to version 1.01) no longer echoes anything to
#   stdout after a successful update of /opt/google/chrome/google-chrome.

# 4.01 - 30th July 2013
# - Emergency 2-char change fix due to a terrible spec parsing bug in rpmbuild.
#   It appears that it tries to parse % directives in comment lines.
#   Strangely, three different build envs of mine didn't have the bug, but
#   a fourth one I tried did.
# 
# 4.00 - 30th July 2013
# - Creates a new chrome-deps RPM that it installs alongside the
#   google-chrome-stable RPM. It contains the Fedora libraries, the
#   built unset_var.so library and a script which is run post-install
#   to add code to /etc/default/google-chrome to modify google-chrome if
#   its LD_PRELOAD addition isn't present. This gets sourced daily by
#   /etc/cron.daily/google-chrome and is a way to auto-modify google-chrome
#   within a day of a Google Chrome update (this is because google-chrome
#   isn't marked as a config file by Google Chrome's spec file, so updates
#   will overwrite any changes made to it). The new code will also enable the
#   Google Chrome repo of course. Many thanks to Marcus Sandberg
#   for his spec file at https://github.com/adamel/chrome-deps which
#   I used as the initial basis for the spec file I create.
# - Adjusted unset_var code to not unset LD_LIBRARY_PATH if a full file
#   path (i.e. one containing a slash) is supplied to exec*() routines.
# - Download/installation of google-chrome-stable/chrome-deps dependencies
#   is now prompted for (if you decline, the script aborts).
# - Moved out-of-date OS check right to the end of the script and it also
#   now offers to reboot the machine after a successful OS update. Warn user
#   not to run Google Chrome if either the OS update or reboot are declined
#   until they complete the OS update and reboot.
# - Don't remove /etc/cron.daily/google-chrome or
#   /etc/yum.repos.d/google-chrome.repo any more because we actually want
#   people to use those (they won't be happy cron'ing this script or having
#   to regularly run it manually to check for updates).
# - Added -t option to specify the temporary directory parent tree.
# - Added -s (stable), -b (beta) and -U (unstable) options to switch
#   release channels. Yes, it remembers the switch, so you only have to
#   specify once time.
# - Added libdl.so.2 to the Fedora library list (for unset_var.so).

# 3.20 - 27th July 2013
# - Initial attempt to stop helper apps crashing by wrapping exec*() routines
#   with LD_PRELOAD functions that save/blank LD_LIBRARY_PATH, call the
#   original routines and, if they return, restore LD_LIBRARY_PATH. Seems to
#   stop crashes previously logged to syslog on startup at least, but does
#   require gcc and its dependencies to be installed now of course.

# 3.11 - 25th July 2013
# - If SELinux is enabled, set appropriate SELinux contexts on Fedora libraries
#   in /opt/google/chrome/lib and that directory itself. Investigation shows
#   that if you enable SELinux and set it to enforcing, nacl_helper appears to
#   fail to start correctly, possibly disabling sandboxing. The script warns
#   about this and suggests a temporary workaround of setting
#   SELINUX=permissive in /etc/selinux/config and rebooting. It's hoped to fix
#   this SELinux issue more permanently in a future release soon (any help is
#   most welcome!).

# 3.10 - 24th July 2013
# - Use .so.0 extension (instead of .so.3) for renamed Fedora ld-linux library
#   and change ld-linux*.so.2 references to ld-linux*.so.0 in ld-linux, libc
#   and libstdc++. Thanks to Marcus Sundberg for this suggestion.
# - Dependency list for Google Chrome RPM is now redhat-lsb, wget, xdg-utils,
#   GConf2, libXScrnSaver and libX11 (not 1.3* or 1.4* though).
# - If OS version ("lsb_release -rs") is less than 6.4 then
#   offer to "yum update" and refuse to continue if the user declines.
#   If you don't update to at least 6.4, bad things can
#   happen (I got a hang and a memory allocation error when starting Google
#   Chrome on a RHEL/CentOS 6.0 VM for example).

# 3.00 - 21st July 2013
# - Command-line options now supported including -d (delete temp dir),
#   -h (syntax help), -n (dry run), -q (quiet) and -u (uninstall).
# - Abort if Google Chrome is running when the script is started.
# - Display any non-zero disk space figures for /opt/google/chrome and the
#   temporary download directory at the start and end of the script.

# 2.10 - 20th July 2013
# - Can now detect if Fedora 15 RPMs have been archived and will download
#   them from the archive site if they're found there instead.
# - Fixed lsb package check, so lsb deps will actually be downloaded now.
# - Follow Fedora 15 library soft-links to determine the actual filenames
#   that need to be copied.
# - Removed /etc/cron.daily/google-chrome and
#   /etc/yum.repos.d/google-chrome.repo straight after the Google Chrome RPM
#   is installed to avoid any potential conflict with old releases.
# - Simplistic check for RHEL/CentOS 6 derivatives (initially a prompt if the
#   script thinks you aren't running one, but a future release will block
#   non-derivatives).
# - Early exits due to errors or an interrupt (CTRL-C) will now properly
#   tidy up files in the temporary directory and uninstall the Google Chrome
#   RPM if it was installed.
# - All downloads now go via a common function, which saves any pre-existing
#   file as a .old version and renames it back if the download fails.

# 2.00 - 14th July 2013
# - Installed a 32-bit RHEL/CentOS 6.4 VM and this enabled me to add initial
#   32-bit support, though there is an nacl_helper issue that I display a warning
#   for. Thanks to Seva Epsteyn for a 32-bit patch that got the ball rolling.
# - Check for version number of latest Google Chrome and download/install it
#   if it hasn't been already.
# - Use updated Fedora 15 RPMs rather than the original ISO versions.
# - Warn if an enabled Google Chrome repo is detected (we don't want it).
# - Tidied main code into separate functions.
# - Added blank lines before/after messages and prefixed them with three stars.
# - Displayed more messages now they're easier to read.

# 1.10 - 13th July 2013
# - Added an update check for a new version of this script.
#   It will always download/install the new version, but will ask
#   if you want to run the new version or exit in case you want to
#   code inspect it first.
# - Always force-install a downloaded Google RPM, even if a version
#   is already installed. Yes, very obvious it should do this but it
#   didn't (slaps forehead).

# 1.02 - 13th July 2013
# - Second emergency fix today as someone spotted that wget needed
#   "--no-check-certificate" to talk to Google's https download site.
#   I didn't need it for the two machines I tested it on though!
# - Added in a check for wget as well while I was at it and it will
#   yum install wget if it's not found.

# 1.01 - 13th July 2013
# - Bad variable fix if you've not downloaded Google Chrome's RPM yet.
#   Serves me right for making a last minute change and not testing it :-(

# 1.00 - 13th July 2013
# - Tested on 64-bit RHEL/CentOS 6.4 using Fedora 15 libraries. Code is there
#   for 32-bit but has not been tested at all because I have no such systems.

message_blank_line()
# $1 != "n" (and no quiet mode) to display blank line
{
   if [ $quiet -eq 0 -a "$1" != "n" ]
   then
      echo
   fi
}

message_output()
# Display $1 depending on the quiet mode
{
   case "$quiet" in
   0) echo "*** $1 ..." ;;
   1) echo "$1" ;;
   esac
}

message()
# Display a message (passed in $1) prominently
# $2 = "n" to avoid displaying blank lines before or after the message
{
   if [ $quiet -eq 2 ]
   then
      return
   fi

   if [ $dry_run -eq 1 ]
   then
      echo "Would display the following message:"
      message_output "$1"
      echo
      return
   fi

   message_blank_line "$2"
   message_output "$1"
   message_blank_line "$2"
}

warning()
# $1 = Warning message to display to stderr
# $2 = "n" to avoid displaying blank lines before or after the message
{
   message "WARNING: $1" "$2" >&2
}

show_space_used()
# Calculate disk space and number of files in install and temp dirs
# and display it if there actually any installed files
{
   for each_tree in "$inst_tree" "$tmp_tree"
   do
      if [ -d "$each_tree" ]
      then
         num_files="`find \"$each_tree/.\" -type f | wc -l`"
         if [ $num_files -gt 0 ]
         then
            size_files="`du -s \"$each_tree/.\" | awk '{ printf(\"%d\",$1/1024); }'`"
            message "$each_tree tree contains $num_files files totalling $size_files MB" "n"
         fi
      fi
   done 
}

clean_up()
# Remove the stuff we don't want to keep once script finishes
{
   # Make sure we don't trash system directories!
   if [ "$tmp_tree" != "" -a "$tmp_tree" != "/" -a "$tmp_tree" != "/tmp" ]
   then
      if [ $delete_tmp -eq 1 ]
      then
         if [ -d "$tmp_tree" ]
         then
            if [ $dry_run -eq 1 ]
            then
               echo "Would delete temporary dir $tmp_tree"
               echo
            else
               cd /
               rm -rf "$tmp_tree"
               if [ -d "$tmp_tree" ]
               then
                  warning "Failed to delete temporary directory $tmp_tree"
               else
                  message "Deleted temporary directory $tmp_tree"
               fi
            fi
         fi
      else
         rm_dir_list="etc lib lib64 usr sbin usr var `basename $tmp_updates`"
         if [ $dry_run -eq 1 ]
         then
            echo "Would delete these directories/files from inside of $tmp_tree:"
            echo "$rm_dir_list"
         else
            # We delete specific directories/files so that RPM downloads/builds
            # remain and can be re-used if the script is run again
            for each_dir in $rm_dir_list
            do
               rm -rf "$tmp_tree/$each_dir"
            done
         fi
      fi

      show_space_used
   fi
}

is_installed()
# See if $1 package is installed (returns non-null string if it is)
{
   rpm -q "$1" | egrep "($rpmarch|$arch|noarch)" | grep "^$1"
}

uninstall_rpms()
# Uninstall $* RPMs if they are installed
{
   uninstall_list=""
   for each_pack in $*
   do
      if [ "`is_installed $each_pack`" != "" ]
      then
         uninstall_list="$uninstall_list $each_pack"
      fi
   done

   if [ "$uninstall_list" != "" ]
   then
      if [ $dry_run -eq 1 ]
      then
         echo "Would uninstall $uninstall_list using \"yum $yum_options remove\""
         echo
      else
         message "Uninstalling $uninstall_list"
         yum $yum_options remove $uninstall_list
      fi
   fi
}

uninstall_google_chrome()
# Uninstall the Google Chrome and chrome-deps-* RPMs if they are installed
{
   # Remove bug fix soft-link if necessary
   if [ "$rpm_type" != "stable" -a -h $chrome_desktop ]
   then
      rm -f $chrome_desktop
   fi

   # Note we use the old name in addition, in case it's still installed
   uninstall_rpms $rpm_name $deps_name

   # Do a final cleanup if /opt/google/chrome* persists
   if [ "$inst_tree" != "" -a "$inst_tree" != "/" -a "$inst_tree" != "/tmp" ]
   then
      if [ -d "$inst_tree" -a $dry_run -eq 0 ]
      then
         warning "$inst_tree install tree still present - deleting it" "n"
         cd /
         rm -rf "$inst_tree"
         if [ -d "$inst_tree" ]
         then
            warning "Failed to delete $inst_tree install tree" "n"
         fi
      fi
   fi
}

error()
# $1 = Error message
# Exit script after displaying error message
{
   if [ $dry_run -eq 1 ]
   then
      echo "Would display this error message to stderr:"
      echo "ERROR: $1 - aborted"
   else
      echo >&2
      echo "ERROR: $1 - aborted" >&2
      echo >&2
   fi

   # Only uninstall/clean up if the superuser
   if [ `id -u` -eq 0 ]
   then
      # A failure means we have to uninstall Google Chrome
      # if it got on the system and we were installing, but only
      # if we got past the check that it was running
      if [ $do_install -eq 1 -a $past_run_check -eq 1 ]
      then
         uninstall_google_chrome
      fi

      clean_up
   fi

   exit 1
}

interrupt()
# Interrupt received (usually CTRL-C)
{
   error "Interrupt (usually CTRL-C) received"
}

set_tmp_tree()
# Set tmp_tree variable to $1/chrome_install
{
   if [ "$1" = "" -o "$1" = "/" -o "`echo \"x$1\" | grep ^x-`" != "" ]
   then
      error "Invalid temporary directory parent specified ($1)"
   fi

   if [ ! -d "$1" ]
   then
      warning "Temporary directory parent $1 doesn't exist - will be created"
   fi

   tmp_tree="$1/chrome_install"
   customsrc="$tmp_tree/missing_functions.c"
   tmp_updates="$tmp_tree/updates.dat$$"
}

check_binary_not_running()
# See if the Google Chrome binary is running and abort if it is
{
   if [ $dry_run -eq 1 ]
   then
      echo "Would check to see if $chrome_name is running and abort if it is."
      echo
   else
      if [ "`ps -ef | grep \"$inst_tree/chrome\" | grep -v grep`" != "" ]
      then
         error "$chrome_name is running - exit it then re-run this script"
      fi
   fi
   past_run_check=1
}

yesno()
# $1 = Message prompt
# $2 = Minimal force level required (1 if not stated)
# Returns ans=0 for no, ans=1 for yes
{
   ans=1
   if [ $dry_run -eq 1 ]
   then
      echo "Would be asked here if you wanted to"
      echo "$1 (y/n - y is assumed)"
   else
      if [ "$2" = "" ]
      then
         minforce=1
      else
         minforce=$2
      fi

      if [ $force -lt $minforce ]
      then
         ans=2
      fi
   fi

   while [ $ans -eq 2 ]
   do
      echo -n "Do you want to $1 (y/n) ?" ; read reply
      case "$reply" in
      Y*|y*) ans=1 ;;
      N*|n*) ans=0 ;;
          *) echo "Please answer y or n" ;;
      esac
   done
}

set_rpm_type()
# Set RPM type to $1
# $1 = stable, beta or unstable
{
   if [ $do_install -eq 1 -a "$1" != "$old_rpm_type" ]
   then
      case "$1" in
      stable|beta|unstable)
         if [ $dry_run -eq 1 ]
         then
            echo "Would prompt to confirm switch to $1 channel"
            echo "(assuming y is input)"
            echo
         else
            warning "You have requested to switch to the $1 channel"
            if [ $quiet -eq 0 ]
            then
               echo "This script will uninstall all previously installed $chrome_name"
               echo "packages that originated from non-$1 channels."
               echo
            fi
            yesno "install the $1 release"
            if [ $ans -eq 0 ]
            then
               error "Did not switch to the $1 channel"
            fi
         fi ;;
      *) error "Invalid $chrome_name channel ($1)" ;;
      esac

      check_binary_not_running
      uninstall_rpms \
      `echo google-chrome-stable google-chrome-beta google-chrome-unstable \
            chrome-deps-stable chrome-deps-beta chrome-deps-unstable | \
       sed -e "s/google-chrome-$1//g" -e "s/chrome-deps-$1//g"`
   fi
   
   case "$1" in
   stable|beta|unstable)
     rpm_type="$1"
     case "$1" in
     unstable) csv_type="dev" ;;
            *) csv_type="$1" ;;
     esac
     rpm_name="google-chrome-$1"
     chrome_csv="http://omahaproxy.appspot.com/all?os=linux&channel=$csv_type"
     chrome_rpm="${rpm_name}_current_$rpmarch.rpm" ;;
   *) error "Invalid $chrome_name type ($1)" ;;
   esac

   case "$1" in
   beta|unstable) swtype="chrome-$1" ;;
               *) swtype="chrome" ;;
   esac
   inst_tree="/opt/google/$swtype"
   libdir="$inst_tree/lib"
   missinglib="libgnome-keyring.so.0"
   customlib="$libdir/$missinglib"
   customlink="$libdir/link-to-${missinglib}"
   chrome_wrapper="$inst_tree/google-$swtype"
   modify_wrapper="$inst_tree/modify_wrapper"
   this_desktop="$app_tree/google-$swtype.desktop"
   deps_name="chrome-deps-$rpm_type"
   deps_latest="`is_installed $deps_name | grep $deps_version`"
}

init_vars()
# Initialise variables
# $1 = Original $0 (i.e. script name)
{
   # Set option variables to temporary values so that errors prior to the
   # actual option parsing behave sensibly
   dry_run=0 ; do_install=0 ; delete_tmp=0 
   past_run_check=0 ; force=0 ; quiet=0

   # Avoid picking up the custom libs for any binaries
   # run by this script
   unset LD_LIBRARY_PATH

   if [ "$TMPDIR" = "" ]
   then
      set_tmp_tree "/tmp"
   else
      set_tmp_tree "$TMPDIR"
   fi

   arch="`uname -m`"
   case "$arch" in
   x86_64) rellib="lib64" ; rpmarch="$arch"
           rpmdep="()(64bit)" ;;
        *) error "Unsupported architecture ($arch)" ;;
   esac
   relusrlib="usr/$rellib"

   chrome_name="Google Chrome"
   # The next definition (chrome_defaults) should probably be different for
   # stable vs. others, but Google haven't changed it because it's not
   # shipped with the RPM, but actually created during installation.
   chrome_defaults="/etc/default/google-chrome"
   chrome_repo="/etc/yum.repos.d/google-chrome.repo"
   app_tree="/usr/share/applications"
   chrome_desktop="$app_tree/google-chrome.desktop"
   deps_version="4.00"
   download_lib="libstdc++.so.6"
   download_lib_xz="$download_lib.xz"

   # Don't get clever and increase good_version to try to install a
   # version 59+ Google Chrome - you'll just break the browser and
   # it'll all end in tears with no way to downgrade again!
   good_version=58 # Last good version - do NOT edit this
   let bad_version=$good_version+1
   bad_version="$chrome_name ${bad_version}+"

   # Find the most stable installed Google Chrome and use that
   # as the default for the rest of the script (override with -b, -s or -U)
   old_rpm_type=""
   for each_old_rpm_type in stable beta unstable
   do
      if [ "$old_rpm_type" = "" ]
      then
         if [ "`is_installed google-chrome-$each_old_rpm_type`" != "" ]
         then
            old_rpm_type="$each_old_rpm_type"
         fi
      fi
   done

   # If nothing installed at all, default to stable
   if [ "$old_rpm_type" = "" ]
   then
      old_rpm_type="stable"
   fi
   set_rpm_type "$old_rpm_type"

   wrapper_mod_version="2.10"
   install_message="already installed"
   trap "interrupt" 1 2 3

   wget="/usr/bin/wget"
   wget_options="--no-check-certificate --no-cache"
   yum_options="-y"
   rpm_options="-U --force --nodeps"
   chcon_options="-u system_u"
   rpmbuild_options="-bb"

   # Update checker URL
   checksite="https://chrome.richardlloyd.org.uk/"
   checkfile="version.dat"
   checkurl="$checksite$checkfile"
   scriptname="install_chrome.sh"
   upgradeurl="$checksite$scriptname"

   script="$1"
   case "$script" in
    ./*) script="`pwd`/`basename $script`" ;;
     /*) script="$script" ;;
      *) script="`pwd`/$script" ;;
   esac
}

download_file()
# $1 = Full URL to download
# $2 = Optional basename to save to (if omitted, then = basename $1)
#      Also allow download to silently fail without exit if $2 is set
# $3 = Optional cksum value to compare download against
# $4 = Optional 0 if failures are warnings, = 1 if errors
# Returns bad_download=0 for success, = 1 for failure
{
   bad_download=0
   if [ "$2" = "" ]
   then
      dlbase="`basename \"$1\"`"
   else
      dlbase="$2"
   fi

   if [ $dry_run -eq 1 ]
   then
      echo "Would download this URL to $tmp_tree/$dlbase :"
      echo $1 ; echo
      return
   fi

   old_dlbase="$dlbase.old"
   if [ -f "$dlbase" ]
   then
      if [ "$3" != "" ]
      then
         # If file already exists with right cksum, do nothing
         if [ "`cksum \"$dlbase\"`" = "$3" ]
         then
            return
         fi
      fi
      rm -f "$old_dlbase"
      mv -f "$dlbase" "$old_dlbase"
   fi

   message "Downloading $dlbase (please wait)"
   $wget $wget_options -O "$dlbase" "$1"

   if [ -s "$dlbase" -a "$3" != "" ]
   then
      if [ "`cksum \"$dlbase\"`" != "$3" ]
      then
         rm -f "$dlbase"
         warning "Deleted downloaded $dlbase - checksum or size incorrect"
      fi
   fi

   if [ ! -s "$dlbase" ]
   then
      bad_download=1
      if [ -f "$old_dlbase" ]
      then
         mv -f "$old_dlbase" "$dlbase"
      fi
      if [ "$2" = "" -o "$3" != "" ]
      then
         if [ "$4" = "0" ]
         then
            warning "Failed to download $dlbase correctly"
         else
            error "Failed to download $dlbase correctly"
         fi
      fi
   fi
}

change_se_context()
# $1 = File or directory name
# Change SELinux context type for $1 to lib_t (or other
# types depending on its name)
{
   if [ $selinux_enabled -eq 0 ]
   then
      # chcon commands fail if SELinux is disabled
      return
   fi

   if [ -s "$1" -o -d "$1" ]
   then
      case "$1" in
      $chrome_wrapper) con_type="execmem_exec_t" ;;
           $customlib) con_type="textrel_shlib_t" ;;
                    *) con_type="lib_t" ;;
      esac

      if [ $dry_run -eq 1 ]
      then
         echo "Would change SELinux context type of $1 to $con_type"
         echo
      else
         chcon $chcon_options -t $con_type "$1"
      fi
   else
      if [ $dry_run -eq 0 ]
      then
         error "Couldn't change SELinux context type of $1 - not found"
      fi
   fi
}

install_custom_lib()
# Compile and install missing function lib as $libdir/libgnome-keyring.so.0
{
   if [ $dry_run -eq 1 ]
   then
      echo "Would compile/install $customlib"
      echo
      return
   fi
     
   cat <<@EOF >"$customsrc"
/* missing_functions.c 3.00 (C) Richard K. Lloyd 2017 <rklloyd@gmail.com>

   Provides a gnome_keyring_attribute_list_new() function (was
   a macro in CentOS 6 causing a missing symbol error when Google Chrome
   was started up) that's present in later libgnome-keyring libraries.
   See: https://mail.gnome.org/archives/commits-list/2012-January/msg08007.html
*/

/* Providing the "missing" gnome_keyring_attribute_list_new function
   -----------------------------------------------------------------
   To avoid having to install various *-devel packages, the required
   definitions in CentOS 6.6 headers have been simplified to avoid the
   need for any include files. I have also added the string "Custom" to the end
   of any definitions that may clash with the original CentOS 6 libraries.
*/

/* Simplifying glib/gtypes.h, glib/garray.h and gnome-keyring.h,
   we get this: */
struct GnomeKeyringAttributeListCustom
{
  char *data;
  int len;
};

/* Simplifying glib/gtypes.h and glib/garray.h, we get this: */
struct GnomeKeyringAttributeListCustom *
g_array_new (int zero_terminated, int clear_, unsigned int element_size);

/* This is straight from gnome-keyring.h: */
typedef enum {
        GNOME_KEYRING_ATTRIBUTE_TYPE_STRING,
        GNOME_KEYRING_ATTRIBUTE_TYPE_UINT32
} GnomeKeyringAttributeTypeCustom;

/* Simplifying glib/gtypes.h and gnome-keyring.h, we get this: */
typedef struct {
        char *name;
        GnomeKeyringAttributeTypeCustom type;
        union {
                char *string;
                unsigned int integer;
        } value;
} GnomeKeyringAttributeCustom;

/* The "missing" function from CentOS 6's gnome-keyring library */
struct GnomeKeyringAttributeListCustom *
gnome_keyring_attribute_list_new (void)
{
   return g_array_new (0, 0, sizeof (GnomeKeyringAttributeCustom));
}
@EOF
   if [ -s "$customsrc" ]
   then
      rm -f "$customlink" "$customlib"

      # Compile 1: Create the library as the link name.
      #            You could probably copy any old system library
      #            in as $customlink to be honest :-)
      gcc -O -fpic -shared -s -o "$customlink" "$customsrc"
      if [ ! -s "$customlink" ]
      then
         error "Failed to compile $customlink library"
      fi

      # Compile 2: Create the library as the system name and link
      #            against the link name
      gcc -O -fpic -shared -s -o "$customlib" "$customsrc" "$customlink"
      if [ ! -s "$customlib" ]
      then
         error "Failed to compile $customlib library"
      fi
     
      # Now remove the link name library/source file and replace the library
      # with a soft-link to the system library. Now we have $customlib with
      # the single function that will also load in the system library. It
      # Would have been easier if there was a built libgnome-keyring.a <sigh>
      rm -f "$customlink" "$customsrc"
      ln -sf "/$relusrlib/$missinglib" "$customlink"

      if [ -h "$customlink" ]
      then
         chmod a+rx "$customlib"
         change_se_context "$customlib"
         message "Compiled/installed $customlib"
      else
         error "Failed to create $customlink soft-link"
      fi
   else
      error "Unable to create $customsrc source file"
   fi
}

check_version()
# Make sure that we are running the latest version
# $* = Params passed to script
{
   # If we're running an upgraded script, -r will have been passed
   # and we don't need a second upgrade
   if [ $re_run -eq 1 ]
   then
      return
   fi

   message "Checking for an update to $scriptname" "n"
   download_file "$checkurl"

   if [ $dry_run -eq 1 ]
   then
      echo "Would check if this running script (version $version) is out of date."
      echo "If it's been superseded, the new version would be downloaded and you'd be asked"
      echo "if you want to upgrade to it and run the new version."
      echo
      return
   fi

   newversionstr="`cat \"$checkfile\"`"
   newversion="`echo $newversionstr | awk '{ print $1; }'`"
   newcksum="`echo $newversionstr | awk '{ print $2; }'`"
   newsize="`echo $newversionstr | awk '{ print $3; }'`"
   rm -f "$checkfile"

   if [ "$newversion" = "$version" ]
   then
      message "$scriptname is already the latest version ($version) - continuing" "n"
   else
      message "New version ($newversion) of $scriptname detected - downloading it now"

      download_file "$upgradeurl.xz" "" "" 0
      if [ $bad_download -eq 0 ]
      then
         xzcat -f "$dlbase" >$scriptname 2>/dev/null
         if [ $? -ne 0 -o ! -s $scriptname ]
         then
            # Corrupted compressed download, delete it and try uncompressed one
            rm -f "$dlbase" "$scriptname"
            download_file "$upgradeurl"
         fi
      else 
         # If compressed version didn't download, try uncompressed one
         download_file "$upgradeurl"
      fi

      if [ "$newcksum" != "" -a "$newsize" != "" ]
      then
         if [ "`cksum \"$scriptname\"`" != "$newcksum $newsize $scriptname" ]
         then 
            rm -f "$scriptname"
            error "Download of $scriptname $newversion failed (bad checksum)"
         fi
      fi

      if [ "$scriptname" -ef "$script" ]
      then
         let a=1
      else
         mv -f "$scriptname" "$script"
      fi
      chmod u+x "$script"
      message "Download of $scriptname $newversion successful"

      yesno "run $scriptname $newversion now"
      if [ $ans -eq 1 ]
      then
         message "OK, executing $script $* -r"
         exec "$script" $* -r
         error "Failed to run $script $* -r"
      else
         if [ $quiet -lt 2 ]
         then
            echo
            echo "$scriptname $newversion is available as $script"
            echo "Please inspect the new code and then run the new script."
            echo
         fi
         clean_up
         exit 1
      fi
   fi
}

find_latest_chrome_version()
# Look on OmahaProxy CSV site or in yum repo for latest version number of linux/$csv_type/current
{
   message "Determining latest $chrome_name version number (please wait)" "n"
   chrome_latest=""

   # Do we have a Google Chrome RPM already installed and also
   # an enabled yum repo for it too?
   if [ "$chrome_installed" != "" -a "`yum repolist google-chrome enabled | grep ^google-chrome`" != "" ]
   then
      if [ $dry_run -eq 1 ]
      then
         echo "Would use yum check-update to determine if there was a later $chrome_name available."
         echo
         return
      fi

      # We have an enabled repo, do use check-update option to look for an update
      chrome_latest="`yum check-update google-chrome-$rpm_type | grep ^google-chrome-$rpm_type |
                      awk '{ print $2; }' | cut -d- -f1`"
   fi

   if [ "$chrome_latest" = "" ]
   then
      # No repo update, so now use OmahaProxy's current CSV to find latest version
      csv_name="chrome_versions.csv"
      download_file "$chrome_csv" "$csv_name"

      if [ $dry_run -eq 1 ]
      then
         echo "Would use OmahaProxy current CSV to determine latest $chrome_name version number"
         echo
         return
      fi

      if [ -s "$csv_name" ]
      then
         chrome_latest="`grep ^linux,$csv_type, \"$csv_name\" | head -1 | cut -d, -f3`"
      fi
      rm -f "$csv_name"
   fi

   if [ "$chrome_latest" = "" ]
   then
      warning "Unable to determine latest $chrome_name version number" "n"
   else
      message "Latest $rpm_name version number is $chrome_latest" "n"
      if [ $centos -eq 6 ]
      then
         case "$chrome_latest" in
         ${good_version}.*)
            warning "$chrome_name $good_version is the last major release that will work on RHEL/CentOS $centos" ;;
         *) for eachrepo in google-chrome google-chrome-beta google-chrome-unstable
            do
               fullrepo=/etc/yum.repos.d/$eachrepo.repo
               if [ -s $fullrepo ]
               then
                  rm -f $fullrepo
                  message "Deleted $fullrepo to prevent future updates" "n"
               fi
            done
            error "Sorry, but $bad_version won't work on RHEL/CentOS $centos" ;;
         esac
      fi
      chrome_name="$chrome_name $chrome_latest"
   fi
}

final_warning()
# On RHEL/CentOS 6, warn that Google Chrome 58 is the end of the road
# and running it long term isn't a good idea for security reasons
{
   if [ "$chrome_installed" != "" -a $centos -eq 6 ]
   then
      case "$chrome_installed" in
      ${good_version}.*)
         warning "Google Chrome $good_version is the last major version that will work on RHEL/CentOS $centos" "n"
         warning "Running it long term will become an increasing security risk!" "n" ;;
      esac
   fi
}

get_installed_version()
# Find out what version of Google Chrome is installed
{
   if [ $dry_run -eq 1 ]
   then
      echo "Would use \"$chrome_wrapper --version\" or"
      echo "\"rpm -q $rpm_name\" to determine installed Google Chrome version"
      echo
      return
   fi

   # Look for the installed RPM first and get version from that
   chrome_installed="`is_installed $rpm_name | cut -d- -f4`"

   # If RPM not installed, see if we can use the shell wrapper for the version
   if [ "$chrome_installed" = "" -a -x "$chrome_wrapper" ]
   then
      # This may fail of course if Google Chrome 28+ installed without custom libstdc++
      chrome_installed="`\"$chrome_wrapper\" --version 2>/dev/null | awk '{ print $3; }'`"
   fi

   final_warning
}

get_downloaded_version()
# Find out what version of Google Chrome RPM was downloaded
{
   if [ $dry_run -eq 1 ]
   then
      chrome_downloaded=""
      echo "Would use \"rpm -qp\" on downloaded Google Chrome RPM to find its version"
      echo
      return
   fi

   if [ -s $chrome_rpm ]
   then
      chrome_downloaded="`rpm -qp \"$chrome_rpm\" | cut -d- -f4`"
      if [ "$chrome_downloaded" = "" ]
      then
         error "Can't find version number of $chrome_rpm"
      fi
   else
      chrome_downloaded=""
   fi
}

download_chrome_rpm()
# Download latest RPM because we don't have it downloaded and don't have
# the latest release installed either
{
   download_file "https://dl.google.com/linux/direct/$chrome_rpm"
   get_downloaded_version

   if [ $dry_run -eq 1 ]
   then
      return
   fi

   if [ "$chrome_latest" = "" ]
   then
      chrome_latest="$chrome_downloaded"
   fi

   if [ "$chrome_downloaded" != "$chrome_latest" ]
   then
      # Downloaded version is different from what OmahaProxy claims is
      # the latest version, so we need to compare the four dot-separated
      # fields of the version numbers to judge which is the higher.
      dotfield=1
      while [ $dotfield -le 4 ]
      do
         dlfield="`echo $chrome_downloaded | cut -d. -f$dotfield`"
         ltfield="`echo $chrome_latest | cut -d. -f$dotfield`"
         if [ "$dlfield" != "" -a "$ltfield" != "" ]
         then
            if [ $dlfield -lt $ltfield ]
            then
               error "Downloaded Google Chrome RPM version ($chrome_downloaded) is older than the latest one ($chrome_latest)"
            else
               # If the downloaded version field is definitely higher, then
               # it's the new latest version and we exit the loop early
               if [ $dlfield -gt $ltfield ]
               then
                  chrome_latest="$chrome_downloaded"
                  dotfield=4
               fi
            fi
         fi
         let dotfield=$dotfield+1
      done
   fi

   message "$chrome_name downloaded successfully" "n"
}

install_chrome_rpm()
# We force install the RPM because RHEL/CentOS 6's packages
# are below the minimum requirements now
{

   if [ $dry_run -eq 1 ]
   then
      echo "Would force-install $chrome_rpm RPM and"
      echo "then check the installed version number is the one it should be"
      return
   fi

   message "Installing $chrome_name RPM (please wait)"

   check_binary_not_running
   rm -f "$inst_tree/chrome"

   # Remove soft-link for bug fix if it exists
   if [ -h $chrome_desktop ]
   then
      rm -f $chrome_desktop
   fi

   # Fix beta/unstable RPM packaging bug by creating a soft-link to the
   # .desktop file about to be unpacked, assuming that the stable package
   # hasn't put one there already
   if [ "$rpm_type" != "stable" -a ! -s $chrome_desktop ]
   then
      ln -sf $this_desktop $chrome_desktop
   fi

   rpm $rpm_options "$chrome_rpm"

   if [ ! -x "$inst_tree/chrome" ]
   then
      error "Failed to install $chrome_name"
   else
      get_installed_version
      if [ "$chrome_installed" = "$chrome_latest" ]
      then
         message "$chrome_name was installed successfully"
         install_message="installed successfully"
         final_warning
      else
         error "Newly-installed Google Chrome version ($chrome_installed) not the latest one ($chrome_latest)"
      fi
   fi
}

update_google_chrome()
# Download and install the latest Google Chrome RPM
# if it's either out of date or not installed yet
{
   get_installed_version
   find_latest_chrome_version
   get_downloaded_version

   if [ $dry_run -eq 1 ]
   then
      echo "Would check if installed Google Chrome is the latest version."
      echo "If it isn't, the latest version would be downloaded and installed."
      echo
      return
   fi

   if [ "$chrome_installed" = "$chrome_latest" -a "$chrome_latest" != "" ]
   then
      message "$chrome_name is already installed - skipping installation"
   else
      if [ "$chrome_downloaded" != "$chrome_latest" -o "$chrome_latest" = "" ]
      then
         download_chrome_rpm
      fi
      install_chrome_rpm
   fi
}

init_setup()
# Get everything setup and do a few basic checks
{
   if [ $quiet -lt 2 ]
   then
      echo "$chrome_name $inst_str $version on the $arch platform"
      echo "(C) Richard K. Lloyd `date +%Y` <rklloyd@gmail.com>"
      show_space_used
      echo
   fi

   if [ $dry_run -eq 1 ]
   then
      echo "Running in dry-run mode (-n) - none of the actions below will be performed."
      if [ $quiet -ne 0 ]
      then
         echo "Please note that combining dry-run and quiet modes isn't a good idea,"
         echo "but I'll continue anyway just to keep you happy."
      fi
      echo
   fi

   # Must run this script as root
   if [ `id -u` -ne 0 ]
   then
      error "You must run $scriptname as the superuser (usually root)"
   fi

   if [ "$tmp_tree" = "" -o "$tmp_tree" = "/tmp" -o "$tmp_tree" = "/" ]
   then
      error "Temporary directory location ($tmp_tree) incorrect"
   fi

   if [ $do_install -eq 0 ]
   then
      return
   fi

   if [ $dry_run -eq 1 ]
   then
      if [ ! -d "$tmp_tree" ]
      then
         echo "Would create temporary $tmp_tree directory"
      fi
      echo "Would change working directory to $tmp_tree"
      echo
   else
      if [ ! -d "$tmp_tree" ]
      then
         message "Creating temporary directory $tmp_tree" "n"
         mkdir -p "$tmp_tree"
         if [ ! -d "$tmp_tree" ]
         then
            error "Couldn't create $tmp_tree directory"
         fi
      fi

      message "Changing working directory to $tmp_tree" "n"
      cd /
      cd "$tmp_tree"
      if [ "`pwd`" != "$tmp_tree" ]
      then
         error "Couldn't change working directory to $tmp_tree"
      fi
   fi
}

check_derivative()
# Check for RHEL/CentOS 6 or 7 family
{
   case "`sed -e 's/ /_/g' </etc/redhat-release 2>/dev/null`" in
   *_6.*) centos=6 ;;
    *_7*) centos=7 ;;
       *) echo
          echo "This OS doesn't look like it's in the RHEL/CentOS 6 or 7 family."
          echo "Very bad things could happen if you continue!"
          echo
          yesno "you want to continue" 2
          if [ $ans -eq 1 ]
          then
             message "OK, but you've been warned (assuming RHEL/CentOS 7 family)"
             centos=7
          else
             error "Probably a wise move"
          fi ;;
   esac

   if [ $centos -eq 7 ]
   then
      # RHEL/CentOS 7 doesn't need chrome-deps-* RPM or build tools
      deps_name="" ; deps_latest="latest"
      fedlibs="was" ; scriptdeps=""
   else
      fedlibs="and extra libraries were"
      scriptdeps=" and its dependencies added by this script"
   fi
}

yum_install()
# Download and Install specified packages if they aren't already installed
# or they are installed, but out-of-date
# $1   = "prompt" Prompt if any of $2.. aren't already installed
# $2.. = List of packages to install
{
   # Nothing to install yet
   install_list=""

   if [ "$1" = "prompt" ]
   then
      prompt=1 ; promptstr="ask for"
   else
      prompt=0 ; promptstr="proceed with" ; ans=1
   fi
   shift

   for each_dep in $*
   do
      if [ "`is_installed $each_dep`" = "" -o "`grep \"^$each_dep$\" $tmp_updates`" != "" ]
      then
         install_list="$install_list $each_dep"
      fi
   done

   if [ "$install_list" != "" ]
   then
      if [ $dry_run -eq 1 ]
      then
         echo "Would $promptstr the installation of these packages and their dependencies:"
         echo "$install_list"
         echo
         return
      fi
          
      echo
      echo "The following packages and their dependencies need downloading/installing:"
      echo
      echo "$install_list"
      if [ $prompt -eq 1 ]
      then
         echo
         yesno "download/install these packages and dependencies"
      fi

      if [ $ans -eq 1 ]
      then
         message "Downloading/installing $install_list (please wait)"
         yum $yum_options install $install_list
      else
         error "Those packages are required by this script"
      fi
   fi
}

request_reboot()
# Request that the user reboots the machine after any upgrade
# $1 = Kernel string number
{
   echo "You are STRONGLY RECOMMENDED to reboot this machine to run the new $1 kernel."
   echo "If you don't, it's extremely likely $chrome_name will not run correctly."
   echo "Please close all applications now (except this script!) if you want to reboot."
   warning "These users are logged into this machine: `users | tr ' ' '\n' | sort -u`"
          
   yesno "reboot this machine immediately" 3

   if [ $ans -eq 1 ]
   then
      message "Rebooting machine now"
      /sbin/shutdown -r now
      exit 0
   fi

   error "You can't run $chrome_name until after the next reboot"
}

check_if_os_obsolete()
# If OS version is less than 6.6, offer to upgrade (and abort if declined).
# We need at least 6.6 because bad things happen in earlier versions
{
   os_version="`lsb_release -rs`"
   case "$os_version" in
   6.0|6.1|6.2|6.3|6.4|6.5)
      if [ $dry_run -eq 1 ]
      then
         echo "Would offer to upgrade your out-of-date OS (version $os_version)."
         echo "If declined, the script will exit and warn you that you must"
         echo "upgrade your OS (and preferably reboot) before it can continue."
         echo
         return
      fi

      echo "Your OS version ($os_version) is out-of-date and will therefore"
      echo "not run $chrome_name correctly."
      echo
      yesno "upgrade your OS" 2

      if [ $ans -eq 1 ]
      then
         message "Upgrading OS to latest release" "n"
         message "You will have a final y/n prompt before updates are downloaded/installed"
         yum update
         new_os_version="`lsb_release -rs`"
         if [ "$new_os_version" = "$os_version" ]
         then
            ans=0
         else
            message "Upgrade to OS version $new_os_version completed successfully"
            request_reboot "$new_os_version"
         fi
      fi

      if [ $ans -eq 0 ]
      then
         error "You declined an OS update to the latest release"
      fi ;;
   esac
}

check_if_kernel_obsolete()
# Although a "yum update" may have been performed, users can exclude kernel updates
# via the appropriate repo file (e.g. they may want to lock down the kernel to
# a particular version that supports third-party binary drivers). The problem with this
# is that recent Google Chrome releases immediately crash on RHEL/CentOS 6 with any
# kernel shipped with RHEL CentOS 6.4 or earlier (i.e. 2.6.32-358.23.2.el6.x86_64 or
# older). Such kernels need to be warned about that an update is needed.
{
   # Get the running kernel version as 4 dotted fields (4th is build nnumber)
   kernelver="`uname -r | sed -e 's/-/./g' | cut -d. -f-4`"

   if [ $dry_run -eq 1 ]
   then
      echo "If the running kernel ($kernelver) is too old, would offer to upgrade it"
      echo "(and preferably reboot)."
      echo
      return
   fi

   dots=1 ; kernelok=1
   for eachdot in 2 6 32 358
   do
      if [ $kernelok -eq 1 ]
      then
         kfield="`echo $kernelver | cut -d. -f$dots`"
         case "$kfield" in
         [0-9]*) # Is the kernel field a number?
            if [ $kfield -gt $eachdot ]
            then
               # Running kernel is new enough, so return and do nothing
               return
            else
               if [ $kfield -lt $eachdot ]
               then
                  kernelok=0
               else
                  let dots=$dots+1
               fi
            fi ;;
            *) # Kernel field not a number, so custom version - let it through with a warning
            warning "Running kernel version ($kernelver) contains a non-number - assuming a recent custom kernel"
            return ;;
          esac
      fi
   done

   echo "Your running kernel version ($kernelver) is out-of-date and this will cause"
   echo "$chrome_name to immediately crash."
   echo
   yesno "download/install the latest kernel" 2

   if [ $ans -eq 1 ]
   then
      message "Upgrading kernel to latest release" "n"
      message "You will have a final y/n prompt before the kernel updates are downloaded/installed"
 
      kernelpacks=""
      for eachpack in kernel kernel-devel kernel-firmware kernel-headers
      do
         if [ "`is_installed $eachpack`" != "" ]
         then
            kernelpacks="$kernelpacks $eachpack"
         fi
      done
      yum update $kernelpacks

      # Might have multiple kernel packages installed, so pick the numerically greatest one
      # installed as the one that will run on the next reboot (if upgrade failed or was declined,
      # this will probably mean the currently running old one ($kernelver)).
      newkernelver="`rpm -q --queryformat '%{VERSION}.%{RELEASE}' kernel |
                     sed -e 's/-/./g' | cut -d. -f-4 |
                     sort -t. -n -r -k1,1 -k2,2 -k3,3 -k4,4 | head -1`"

      if [ "$newkernelver" = "$kernelver" ]
      then
         error "You declined a kernel update to the latest release (or it failed)"
      else
         message "Download/install of latest kernel ($newkernelver) completed successfully"
         request_reboot "$newkernelver"
      fi
   fi

   if [ $ans -eq 0 ]
   then
      error "$chrome_name should not be run until you upgrade this machine's kernel via \"yum update\" and reboot it after the upgrade"
   fi
}

install_prebuilt_library()
# Download pre-built 64-bit libstdc++ library from script site
{
   if [ $dry_run -eq 1 ]
   then
      echo "Would download and install the $download_lib library"
      echo
      return
   fi

   # We need to create library dir because we haven't installed
   # the Google Chrome RPM yet
   if [ ! -d "$libdir" ]
   then
      mkdir -p -m 755 "$libdir"
      if [ ! -d "$libdir" ]
      then
         error "Can't create $chrome_name library dir ($libdir)"
      fi
   fi

   download_file "$checksite$download_lib_xz" "$download_lib_xz" "3060059325 350920 $download_lib_xz" 1

   destlib="$libdir/$download_lib"
   xzcat -f "$download_lib_xz" >$destlib
   if [ -s $destlib ]
   then
      chmod a+rx "$destlib"
      change_se_context "$destlib"
      message "Installed $destlib" 
   else
      rm -f "$destlib"
      error "Failed to install $download_lib"
   fi
}

bulk_warning()
# Multi-line warning message in $1, $2 and $3
{
   if [ $dry_run -eq 1 ]
   then
      echo "Would display this warning to stderr:"
      echo "$1"
      echo "$2"
      echo "$3"
   else
      echo >&2
      echo "WARNING:" >&2
      echo "$1" >&2
      echo "$2" >&2
      echo "$3." >&2
   fi
}

final_messages()
# Display final installation messages before exiting
{
   if [ $quiet -eq 2 -o $do_install -eq 0 ]
   then
      return
   fi

   echo
   if [ $dry_run -eq 1 ]
   then
      echo "Would display these final messages after a successful run:"
      echo
   fi

   echo "$chrome_name $fedlibs $install_message."
   echo "Please run the browser via the '`basename $chrome_wrapper`' command as a non-root user."
   final_warning
   echo

   echo "To update Google Chrome, run \"yum update $rpm_name\" or"
   echo "simply re-run this script with \"./$scriptname\"."
   echo
   echo "To uninstall Google Chrome$scriptdeps,"
   echo "run \"yum remove $rpm_name $deps_name\" or \"./$scriptname -u\"."
   echo
}

parse_options()
# Parse script options passed as $*
{
   delete_tmp=0 ; dry_run=0 ; re_run=0 ; do_install=1
   inst_str="Installer"
   risky_type="$old_rpm_type"

   while [ "x$1" != "x" ]
   do
      case "$1" in
      -\?|-h|--help)  show_syntax ; exit 0 ;;
      -b|--beta)      risky_type="beta" ;;
      -d|--delete)    delete_tmp=1 ;;
      -f|--force)     let force=$force+1 ;;
      -n|--dryrun)    dry_run=1 ;;
      -q|--quiet)     if [ $quiet -lt 2 ]
                      then
                        let quiet=$quiet+1
                      fi ;;
      -r|--re-run)    re_run=1 ;;
      -s|--stable)    risky_type="stable" ;;
      -t|--tmpdir)    shift ; set_tmp_tree "$1" ;;
      -u|--uninstall) do_install=0 ; inst_str="Uninstaller" ;;
      -U|--unstable)  risky_type="unstable" ;;
       *)             show_syntax >&2
                      error "Invalid option ($1)" ;;
      esac
      shift
   done

   if [ $quiet -ne 0 ]
   then
      wget_options="$wget_options -q"
      yum_options="$yum_options -q"
      rpm_options="$rpm_options --quiet"
      rpmbuild_options="$rpmbuild_options --quiet"
   else
      rpm_options="$rpm_options -vh"
      chcon_options="$chcon_options -v"
   fi

   if [ "$risky_type" != "$old_rpm_type" ]
   then
      set_rpm_type "$risky_type"
   fi
}

create_spec_file()
# Create chrome-deps-*.spec file for building the chrome-deps-* RPM.
# Many thanks to to Marcus Sandberg for his (public domain) spec file at
# https://github.com/adamel/chrome-deps which I have used as a basis for the
# spec file that this script creates.
{
   ( cat <<@EOF
# Much of this spec file was taken from Marcus Sandberg's fine (public domain)
# effort at https://github.com/adamel/chrome-deps although it has been
# modified compared to his version.

Name:		@DEPS_NAME@
Version:	@DEPS_VERSION@
Release:	1
Summary:	Dependencies required for Google Chrome 28+ on RHEL/CentOS 6 derivatives
License:	GPLv3+, GPLv3+ with exceptions, GPLv2+ with exceptions, public domain
Group:		System Environment/Libraries
Obsoletes:	chrome-deps
Provides:       @LIBDIR@/link-to-@MISSINGLIB@@RPMDEP@
URL:		@CHECKSITE@
Vendor:         Richard K. Lloyd and the Fedora Project
Packager:       Richard K. Lloyd <rklloyd@gmail.com>
BuildRoot:	@BUILDROOT@

%description
Includes an later libstdc++ Library, a shared library
(@MISSINGLIB@) and a soft-link to load in the original
@MISSINGLIB@ system library. Also modifies Google Chrome's
@CHROME_WRAPPER@ wrapper script to allow
Google Chrome 28 or later to run on RHEL/CentOS 6 derivatives.
The URL for the script that downloaded and re-packaged the
later libstdc++ library in this RPM is
@CHECKSITE@@SCRIPTNAME@
and it is in the public domain.

# List of libraries to include in the RPM
%files
%defattr(-,root,root,-)
@MODIFY_WRAPPER@
@LIBDIR@/libstdc++.so.6
@LIBDIR@/@MISSINGLIB@
@LIBDIR@/link-to-@MISSINGLIB@

# No prep or build rules because it's all been done by @SCRIPTNAME@

# Install a copy of libraries into build root
%install
rm -rf %{buildroot}
mkdir -p -m 755 %{buildroot}@LIBDIR@
cp -pf @MODIFY_WRAPPER@ %{buildroot}@INST_TREE@
cp -pf @LIBDIR@/lib*.so.* %{buildroot}@LIBDIR@/
ln -sf /@RELUSRLIB@/@MISSINGLIB@ %{buildroot}@LIBDIR@/link-to-@MISSINGLIB@

# Run modify_wrapper once the files are installed
%post
@MODIFY_WRAPPER@

# At end of build, remove build root
%clean
rm -rf %{buildroot}

# Changelog, with annoyingly "wrong" US date format
%changelog
* Thu May  4 2017 Richard K. Lloyd <rklloyd@gmail.com> - 4.00-1
- New libstdc++ library release.
* Thu Dec 22 2016 Richard K. Lloyd <rklloyd@gmail.com> - 3.15-1
- New libstdc++ library release.
* Fri Aug 26 2016 Richard K. Lloyd <rklloyd@gmail.com> - 3.14-1
- New libstdc++ library release.
* Fri Apr 29 2016 Richard K. Lloyd <rklloyd@gmail.com> - 3.13-1
- New libstdc++ library release.
* Tue Dec 15 2015 Richard K. Lloyd <rklloyd@gmail.com> - 3.12-1
- New libstdc++ library release.
* Tue Feb 23 2015 Richard K. Lloyd <rklloyd@gmail.com> - 3.11-1
- Added a Provides: line to avoid an RPM dependency issue.
* Fri Feb  6 2015 Richard K. Lloyd <rklloyd@gmail.com> - 3.10-1
- LD_PRELOAD unset_var.so library finally removed.
- Created new single-function @MISSINGLIB@ library.
- Added link-to-@MISSINGLIB@ soft-link to bring in
  functions from system-installed @MISSINGLIB@.
* Mon Feb  2 2015 Richard K. Lloyd <rklloyd@gmail.com> - 3.00-1
- Removed all patched Fedora libraries.
- Added an unpatched libstdc++ library (from gcc or CentOS 7).
* Fri Aug 29 2014 Richard K. Lloyd <rklloyd@gmail.com> - 2.10-1 
- Added "Obsoletes: chrome-deps" to spec file.
- Redirected stdout/stderr to /dev/null in google-chrome script.
* Sun Jul 27 2014 Richard K. Lloyd <rklloyd@gmail.com> - 2.00-1
- Scan for all three RPM types in /etc/defaults/chrome.
* Sat May 17 2014 Richard K. Lloyd <rklloyd@gmail.com> - 1.21-1
- Unset LD_LIBRARY_PATH for self-calls to the google-chrome script
  Fedora @KEYRINGVER@ RPM.
* Sat Apr 12 2014 Richard K. Lloyd <rklloyd@gmail.com> - 1.20-1
- Added libgnome-keyring.so.0, extracted from the libgnome-keyring
  Fedora @KEYRINGVER@ RPM.
* Wed Dec 11 2013 Richard K. Lloyd <rklloyd@gmail.com> - 1.10-1
- Additionally saved/unset/restored the LD_PRELOAD environmental
  variable in unset_var.c to stop exec'ed() processes using it.
* Sat Oct  5 2013 Richard K. Lloyd <rklloyd@gmail.com> - 1.03-1
- Added libgdk_pixbuf-2.0.so.0, extracted from the gdk-pixbuf2
  Fedora @FEDVER@ RPM.
* Fri Oct  4 2013 Richard K. Lloyd <rklloyd@gmail.com> - 1.02-1
- Added libgio-2.0 and libgobject-2.0 to the set of included
  Fedora @FEDVER@ libraries.
* Thu Aug  8 2013 Richard K. Lloyd <rklloyd@gmail.com> - 1.01-1
- Updated unset_var.c to fix Google Talk Plugin crash.
* Sun Jul 28 2013 Richard K. Lloyd <rklloyd@gmail.com> - 1.00-1
- Initial version based on Marcus Sandberg's fine work at
  https://github.com/adamel/chrome-deps (differences are below).
- All the Fedora @FEDVER@ and @KEYRINGVER@ library downloads, unpacking and modifications are
  done in the @SCRIPTNAME@ script that generated this spec file, rather
  than run as spec file commands.
- LD_PRELOAD unset_var.so library and @MODIFY_WRAPPER@
  script are both included in the built RPM.
@EOF
   ) | sed \
   -e "s#@DEPS_VERSION@#$deps_version#g" \
   -e "s#@DEPS_NAME@#$deps_name#g" \
   -e "s#@CHECKSITE@#$checksite#g" \
   -e "s#@FEDVER@#$fedver#g" \
   -e "s#@SCRIPTNAME@#$scriptname#g" \
   -e "s#@LIBDIR@#$libdir#g" \
   -e "s#@MISSINGLIB@#$missinglib#g" \
   -e "s#@RPMDEP@#$rpmdep#g" \
   -e "s#@RELUSRLIB@#$relusrlib#g" \
   -e "s#@CHROME_WRAPPER@#$chrome_wrapper#g" \
   -e "s#@MODIFY_WRAPPER@#$modify_wrapper#g" \
   -e "s#@INST_TREE@#$inst_tree#g" \
   -e "s#@BUILDROOT@#$rpmbuilddir/BUILDROOT#g" \
   >"$specfile"
}

setup_build_env()
# Create RPM build environment under %_topdir and also
# create the chrome-deps-*.spec file
{
   rpmbuilddir="`rpm --eval %_topdir`"
   if [ "$rpmbuilddir" = "" -o "$rpmbuilddir" = "%_topdir" ]
   then
      error "Can't determine RPM build dir"
   fi
   built_rpm="$rpmbuilddir/RPMS/$rpmarch/$built_rpm_base"
   specsdir="$rpmbuilddir/SPECS"
   specfile="$specsdir/$deps_name.spec"
   setuptree="/usr/bin/rpmdev-setuptree"

   if [ $dry_run -eq 1 ]
   then
      echo "Would create the build environment tree ($rpmbuilddir)"
      echo "and also the $deps_name spec file ($specfile)."
      echo
      return
   fi

   if [ ! -d "$specsdir" ]
   then
      if [ -x "$setuptree" ]
      then
         $setuptree
      fi

      if [ ! -d "$specsdir" ]
      then
         error "Unable to correctly run $setuptree to create build environment"
      fi
   fi
}

build_deps_rpm()
# Create chrome-deps-* RPM from the chrome-deps-*.spec file and install it
{
   built_rpm_base="$deps_name-$deps_version-1.$rpmarch.rpm"
   tmpdir_rpm="$tmp_tree/$built_rpm_base"

   # Only build latest chrome-deps-* RPM if we haven't already got it
   if [ ! -s "$tmpdir_rpm" ]
   then
      # Get ready for RPM build
      setup_build_env

      if [ $dry_run -eq 1 ]
      then
         echo "Would run rpmbuild to create $tmpdir_rpm"
         echo
      else
         # Create chrome-deps-*.spec file
         create_spec_file

         cd "$specsdir"
         message "Building $tmpdir_rpm"
         rm -f "$tmpdir_rpm"

         rpmbuild $rpmbuild_options "`basename \"$specfile\"`"
         rm -f "$specfile"

         if [ -s "$built_rpm" ]
         then
            mv -f "$built_rpm" "$tmpdir_rpm"
            built_rpm="$tmpdir_rpm"
         fi

         if [ ! -s "$built_rpm" ]
         then
            error "Failed to build $tmpdir_rpm"
         fi
      fi
   fi

   if [ $dry_run -eq 1 ]
   then
      echo "Would install $tmpdir_rpm"
      echo
   else
      message "Installing $tmpdir_rpm"
      rpm $rpm_options "$tmpdir_rpm"
   fi
}

adjust_chrome_defaults()
# Create a modify_wrapper script to be included in chrome-deps-* that modifies
# /etc/default/google-chrome if necessary to doing the following
# (for all 3 RPM tpyes):
# - Remove any existing setting of repo_add_once
# - Updates (or adds) a custom ### START .. ### END section, which will
#   ajusted the exec cat commands in google-chrome.
# - Sets repo_add_once to true (picked up by /etc/cron.daily/google-chrome)
# modify_wrapper is run once at the end of the chrome-deps-* RPM installation.
{
   if [ $dry_run -eq 1 ]
   then
      echo "Would create a modify_wrapper script to modify $chrome_defaults."
      echo "The script would ensure the creation of $chrome_repo and"
      echo "the adjustment of exec cat commands in $chrome_wrapper."
      echo
      return
   fi

   ( cat <<@EOF
#! /bin/bash
# @MODIFY_WRAPPER@ @WRAPPER_MOD_VERSION@ (C) Richard K. Lloyd 2017 <rklloyd@gmail.com>
# Created by @SCRIPTNAME@ and included in the @DEPS_NAME@ RPM
# to modify @CHROME_DEFAULTS@ in the following ways:
# - Remove any existing setting of repo_add_once
# - Updates (or adds) a custom ### START .. ### END section, which will
#   adjust the dubious "exec cat" commands in google-chrome.
# - Sets repo_add_once to true (picked up by /etc/cron.daily/google-chrome)
# @MODIFY_WRAPPER@ is run once at the end of the @DEPS_NAME@ RPM installation.

chrome_defaults="@CHROME_DEFAULTS@"
progname="\`basename \$0\`"

error()
{
   echo "\$progname: ERROR: \$1 - aborted" >&2
   exit 1
}

# Create defaults file if it doesn't exist
touch "\$chrome_defaults"
if [ ! -f "\$chrome_defaults" ]
then
   error "Can't create \$chrome_defaults"
fi

update_file()
# \$1 = File to update with contents of stdin
{
   nfile="\$1.new" ; ofile="\$1.old"
   cat >"\$nfile"
   if [ ! -f "\$nfile" ]
   then
      rm -f "\$nfile"
      error "Failed to create temporary update file \$nfile"
   fi

   # Don't do update if new file is the same as old one
   if [ "\`diff \"\$1\" \"\$nfile\"\`" = "" ]
   then
      rm -f "\$nfile"
      return
   fi

   mv -f "\$1" "\$ofile"
   if [ ! -f "\$ofile" ]
   then
      error "Failed to create temporary backup of \$1"
   fi

   mv -f "\$nfile" "\$1"
   rm -f "\$nfile"
   if [ ! -f "\$1" ]
   then
      mv -f "\$ofile" "\$1"
      chmod a+r "\$1"
      error "Failed to update \$1"
   fi
   
   chmod a+r "\$1"
   rm -f "\$ofile"
}

grep -v repo_add_once= "\$chrome_defaults" | awk '
BEGIN { wrapper_mod=0; exclude_mod=0; end_of_mod=0; }
{
   if (\$4==scriptname)
   {
      if (\$2=="START")
      {
         if (\$3==wrapper_mod_version)
         {
            wrapper_mod=1; exclude_mod=0;
         }
         else exclude_mod=1;
      }
      else
      if (\$2=="END") end_of_mod=1;
   }

   if (!exclude_mod) printf("%s\n",\$0);

   if (end_of_mod) { exclude_mod=0; end_of_mod=0; }
}
END {
   if (!wrapper_mod)
   {
      printf("### START %s %s modifications\n",
             wrapper_mod_version,scriptname);
      printf("old_line=\"exec cat\"\n");
      printf("for eachtype in \"\" -beta -unstable\n");
      printf("do\n");
      printf("   chrome_wrapper=\"/opt/google/chrome\$eachtype/google-chrome\$eachtype\"\n");
      printf("   if [ -s \"\$chrome_wrapper\" ]\n");
      printf("   then\n");
      printf("      if [ \"\`grep \\\\\"\$old_line\\\\\" \\\\\"\$chrome_wrapper\\\\\"\`\" != \"\" ]\n");
      printf("      then\n");
      printf("         new_wrapper=\"\$chrome_wrapper.new\"\n");
      printf("         sed -e \"s#>(exec cat)#/dev/null#g\" -e \"s#>(exec cat >&2)#/dev/null#g\" <\"\$chrome_wrapper\" >\"\$new_wrapper\"\n");
      printf("         if [ -s \"\$new_wrapper\" ]\n");
      printf("         then\n");
      printf("            mv -f \"\$new_wrapper\" \"\$chrome_wrapper\"\n");
      printf("            chmod a+rx \"\$chrome_wrapper\"\n");
      printf("         fi\n");
      printf("      fi\n");
      printf("   fi\n");
      printf("done\n");
      printf("### END %s %s modifications\n",
             wrapper_mod_version,scriptname);
   }
   printf("repo_add_once=\"true\"\n");
}' \
wrapper_mod_version="@WRAPPER_MOD_VERSION@" scriptname="@SCRIPTNAME@" \
customlib="@CUSTOMLIB@" |
update_file "\$chrome_defaults"

# Now actually run the defaults file (it will be run daily via cron or
# when the google-chrome-stable RPM is installed or updated),
# so that google-chrome is updated if it needs to be
if [ -s "\$chrome_defaults" ]
then
   . "\$chrome_defaults"
fi

exit 0
@EOF
) | sed \
   -e "s#@MODIFY_WRAPPER@#`basename \"$modify_wrapper\"`#g" \
   -e "s#@WRAPPER_MOD_VERSION@#$wrapper_mod_version#g" \
   -e "s#@SCRIPTNAME@#$scriptname#g" \
   -e "s#@DEPS_NAME@#$deps_name#g" \
   -e "s#@CHROME_DEFAULTS@#$chrome_defaults#g" \
   -e "s#@DEPS_NAME@#$deps_name#g" \
   -e "s#@CUSTOMLIB@#`basename \"$customlib\"`#g" \
   >"$modify_wrapper"

   if [ -s "$modify_wrapper" ]
   then
      chmod a+rx "$modify_wrapper"
      change_se_context "$modify_wrapper"
      message "Created $modify_wrapper successfully"
   else
      error "Failed to create $modify_wrapper"
   fi
}

main_code()
# Initialisation complete, so run the code
{
   # Get rid of old chrome-deps RPM
   uninstall_rpms chrome-deps

   if [ $do_install -eq 1 ]
   then
      # Only install RPM-building packages if latest chrome-deps-* isn't installed
      # and we're using RHEL/CentOS 6.X
      if [ "$deps_latest" = "" -a $centos -eq 6 ]
      then
         rpm_extra_packages="gcc glibc-devel rpm-build rpmdevtools"
      else
         rpm_extra_packages=""
      fi

      if [ $selinux_enabled -eq 1 ]
      then
         rpm_extra_packages="$rpm_extra_packages selinux-policy"
      fi
      
      # Make sure google-chrome-stable and chrome-deps-* dependencies are present
      # but prompt for their download/install if any aren't 
      yum_install prompt redhat-lsb xdg-utils GConf2 libXScrnSaver libX11 gnome-keyring nss PackageKit libexif dbus $rpm_extra_packages

      if [ $centos -eq 6 ]
      then
         # dbus will be installed by this point, but it must also be running
         # and started up on the next reboot
         if [ "`service messagebus status 2>/dev/null | grep running`" = "" ]
         then
            rm -f /var/run/messagebus.pid # Might have stayed after a crash
            service messagebus start
            chkconfig messagebus on
         fi
      fi

      # Now update Google Chrome if necessary
      update_google_chrome

      if [ "$deps_latest" = "" -a $centos -eq 6 ]
      then
         # Download/install libstdc++ library
         install_prebuilt_library

         # Adjust /etc/default/google-chrome (sourced in daily by
         # /etc/cron.daily/google-chrome) as required
         adjust_chrome_defaults

         # Build/install custom library if latest chrome-deps-* not installed
         install_custom_lib

         # Build and install the chrome-deps-* RPM if the latest isn't installed
         build_deps_rpm

         # That's the end of $libdir changes, so change its SELinux context type
         change_se_context "$libdir"
      fi
   else
      # If it's installed, uninstall Google Chrome and dependency packages
      check_binary_not_running
      uninstall_google_chrome
   fi
}

check_selinux()
# See if SELinux is enabled and if it's enforcing
{
   selinux_enforcing=0 ; selinux_enabled=0

   # Yes, there's a value-returning util (0=enabled, ho hum, so we flip it)
   # but it may not exist, so fallback on /selinux dir existence
   if [ -x /usr/sbin/selinuxenabled ]
   then
      /usr/sbin/selinuxenabled
      let selinux_enabled=1-$?
   else
      if [ -d /selinux ]
      then
         selinux_enabled=1
      fi
   fi

   if [ $selinux_enabled -eq 1 ]
   then
      # Enforcing mode upsets nacl_helper, so try to see if we're using it
      if [ -f /selinux/enforce ]
      then
         selinux_enforcing="`cat /selinux/enforce`"
      fi
   fi
}

init_packages()
# Get a list of packages that are pending an update and
# also make sure up-to-date wget and xz are installed early on
# (for the version.dat download and possible script upgrade).
{
   message "Generating a list of out-of-date packages (please wait)"
   yum list updates | egrep "($arch|noarch)" | awk '{ print $1 }' | cut -d. -f1 | sort -u >$tmp_updates
   yum_install "" wget xz
}

# Initialisation functions
init_vars $0
check_derivative
check_selinux
parse_options $*
check_binary_not_running
init_setup
init_packages
check_version $*

# Now do the install or uninstall
main_code

# Finalisation functions
clean_up
final_messages

if [ $do_install -eq 1 ]
then
   # Need at least version 6.6 of OS to run Google Chrome successfully
   check_if_os_obsolete

   # Also need at least version 2.6.32.431 of the kernel
   check_if_kernel_obsolete
fi

# A good exit
exit 0
