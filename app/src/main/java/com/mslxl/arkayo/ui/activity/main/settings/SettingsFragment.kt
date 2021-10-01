package com.mslxl.arkayo.ui.activity.main.settings

import android.os.Bundle
import androidx.preference.ListPreference
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import androidx.preference.PreferenceManager
import com.mslxl.arkayo.R

class SettingsFragment : PreferenceFragmentCompat() {


    override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
        setPreferencesFromResource(R.xml.settings_preference_layout, rootKey)

        val sharedPrefs = PreferenceManager.getDefaultSharedPreferences(context)

        fun ListPreference.initSummaryListener() {
            this.onPreferenceChangeListener = Preference.OnPreferenceChangeListener { _, newValue ->
                summary = newValue.toString()
                true
            }
        }


        findPreference<ListPreference>("pref_screencapMode")!!.apply {
            summary = sharedPrefs.getString(
                "pref_screencapMode",
                getString(R.string.pref_screencapMode_def)
            )
            initSummaryListener()
        }

        findPreference<ListPreference>("pref_clickMode")!!.apply {
            summary =
                sharedPrefs.getString("pref_clickMode", getString(R.string.pref_clickMode_def))
            initSummaryListener()
        }

        findPreference<ListPreference>("pref_ocrSrc")!!.apply {
            summary = sharedPrefs.getString("pref_ocrSrc", getString(R.string.pref_ocrSrc_def))
            initSummaryListener()
        }

        findPreference<ListPreference>("pref_gameVersion")!!.apply {
            summary =
                sharedPrefs.getString("pref_gameVersion", getString(R.string.pref_gameVersion_def))
            initSummaryListener()
        }

        findPreference<ListPreference>("pref_afterSinTask")!!.apply {
            summary =
                sharedPrefs.getString("pref_afterSinTask", getString(R.string.pref_gameVersion_def))
            initSummaryListener()
        }
    }
}