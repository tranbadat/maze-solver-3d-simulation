'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogEntry } from '@/lib/astar';

interface LogsPanelProps {
  logs: LogEntry[];
  pathLength: number;
}

export const LogsPanel = ({ logs, pathLength }: LogsPanelProps) => {
  const infoLogs = logs.filter(l => l.level === 'INFO');
  const errorLogs = logs.filter(l => l.level === 'ERROR');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Logs & Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No logs yet</p>
        ) : (
          <>
            {pathLength > 0 && (
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  ✓ Path Found! Length: {pathLength}
                </p>
              </div>
            )}

            {errorLogs.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">Errors:</p>
                {errorLogs.map((log, idx) => (
                  <div key={idx} className="text-xs text-red-800 dark:text-red-200 mb-1">
                    <span className="font-mono">{log.message}</span>
                    {log.data && (
                      <div className="text-red-700 dark:text-red-300 ml-2">
                        {JSON.stringify(log.data, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Execution Details:</p>
              {infoLogs.map((log, idx) => (
                <div key={idx} className="text-xs bg-muted p-2 rounded font-mono break-words">
                  <div className="text-muted-foreground">[{log.timestamp}]</div>
                  <div className="text-foreground">{log.message}</div>
                  {log.data && (
                    <div className="text-muted-foreground text-xs mt-1">
                      {JSON.stringify(log.data, null, 2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
