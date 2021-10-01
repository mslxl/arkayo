package com.mslxl.arkayo.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.mslxl.arkayo.R
import com.mslxl.arkayo.ui.activity.main.MainActivity

class MediaForegroundService : Service() {
    override fun onBind(p0: Intent?): IBinder? = null
    private fun createForegroundNotification(): Notification {
        val notificationManager: NotificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val notificationChannelId = "notification_channel_id_01"

        // Android8.0以上的系统，新建消息通道
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelName = "Foreground Service Notification"
            val importance: Int = NotificationManager.IMPORTANCE_HIGH
            val notificationChannel =
                NotificationChannel(notificationChannelId, channelName, importance)
//            notificationChannel.description = ""
            notificationManager.createNotificationChannel(notificationChannel)
        }
        val builder: NotificationCompat.Builder =
            NotificationCompat.Builder(this, notificationChannelId)
        builder.setSmallIcon(R.mipmap.ic_launcher)
        builder.setContentTitle(getString(R.string.notify_fg_media_title))
        builder.setContentText(getString(R.string.notify_fg_media_desc))
        val activityIntent = Intent(this, MainActivity::class.java)
        val pendingIntent: PendingIntent =
            PendingIntent.getActivity(this, 1, activityIntent, PendingIntent.FLAG_UPDATE_CURRENT)
        builder.setContentIntent(pendingIntent)

        return builder.build()
    }

    override fun onCreate() {
        super.onCreate()
        val notification = createForegroundNotification()
        startForeground(1, notification)
    }

    override fun onDestroy() {
        super.onDestroy()
        stopForeground(true)
    }
}